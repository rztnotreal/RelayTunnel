using System;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace RelayTunnel;

static class Program
{
    private static Mutex? _mutex;

    [STAThread]
    static void Main()
    {
        const string appGuid = "RelayTunnel-AI-Shield-Instance-Lock";
        _mutex = new Mutex(true, appGuid, out bool isNewInstance);

        if (!isNewInstance)
        {
            MessageBox.Show("RelayTunnel уже запущен.", "RelayTunnel", MessageBoxButtons.OK, MessageBoxIcon.Information);
            return;
        }

        ApplicationConfiguration.Initialize();
        Application.Run(new MainWindow());
    }
}

public class MainWindow : Form
{
    private readonly WebView2 _webView;
    private readonly NotifyIcon _trayIcon;

    [DllImport("user32.dll")]
    public static extern int SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);

    [DllImport("user32.dll")]
    public static extern bool ReleaseCapture();

    [DllImport("dwmapi.dll")]
    private static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);

    private const int WM_NCLBUTTONDOWN = 0xA1;
    private const int HT_CAPTION = 0x2;
    private const int DWMWA_USE_IMMERSIVE_DARK_MODE = 20;
    private const int DWMWA_WINDOW_CORNER_PREFERENCE = 33;
    private const int DWMWCP_ROUND = 2;

    public MainWindow()
    {
        // Window properties
        Text = "RelayTunnel • AI Shield & Clean Routing";
        FormBorderStyle = FormBorderStyle.None;
        StartPosition = FormStartPosition.CenterScreen;
        ClientSize = new Size(420, 640);
        BackColor = Color.FromArgb(20, 20, 20);
        ShowInTaskbar = true;
        MaximizeBox = false;

        // Tray icon
        _trayIcon = new NotifyIcon
        {
            Text = "RelayTunnel - AI Kill Switch",
            Icon = SystemIcons.Shield,
            Visible = true
        };

        var trayMenu = new ContextMenuStrip();
        trayMenu.Items.Add("Открыть RelayTunnel", null, (s, e) => ShowAndRestore());
        trayMenu.Items.Add(new ToolStripSeparator());
        trayMenu.Items.Add("Выход", null, (s, e) => CloseApp());
        _trayIcon.ContextMenuStrip = trayMenu;
        _trayIcon.DoubleClick += (s, e) => ShowAndRestore();

        // Apply Windows 11 Dark Mode & Rounded Corners
        try
        {
            int darkMode = 1;
            DwmSetWindowAttribute(Handle, DWMWA_USE_IMMERSIVE_DARK_MODE, ref darkMode, sizeof(int));
            int corners = DWMWCP_ROUND;
            DwmSetWindowAttribute(Handle, DWMWA_WINDOW_CORNER_PREFERENCE, ref corners, sizeof(int));
        }
        catch { }

        // WebView2 control
        _webView = new WebView2
        {
            Dock = DockStyle.Fill,
            DefaultBackgroundColor = Color.FromArgb(20, 20, 20)
        };

        Controls.Add(_webView);

        InitializeWebViewAsync();
    }

    private async void InitializeWebViewAsync()
    {
        try
        {
            // Set user data folder in LocalAppData
            string userDataDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "RelayTunnel", "WebView2Data");
            Directory.CreateDirectory(userDataDir);

            var env = await CoreWebView2Environment.CreateAsync(null, userDataDir);
            await _webView.EnsureCoreWebView2Async(env);

            _webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
            _webView.CoreWebView2.Settings.AreDevToolsEnabled = true;
            _webView.CoreWebView2.Settings.IsZoomControlEnabled = false;
            _webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;

            // Handle messages from React UI
            _webView.CoreWebView2.WebMessageReceived += OnWebMessageReceived;

            // Resolve dist directory
            string appDir = AppDomain.CurrentDomain.BaseDirectory;
            string distPath = Path.Combine(appDir, "dist");
            if (!Directory.Exists(distPath))
            {
                // check parent dirs
                string parentDist = Path.Combine(appDir, "..", "..", "..", "dist");
                if (Directory.Exists(parentDist))
                {
                    distPath = Path.GetFullPath(parentDist);
                }
            }

            if (Directory.Exists(distPath))
            {
                _webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                    "relaytunnel.local",
                    distPath,
                    CoreWebView2HostResourceAccessKind.Allow
                );
                _webView.CoreWebView2.Navigate("https://relaytunnel.local/index.html");
            }
            else
            {
                // Fallback to local dev server
                _webView.CoreWebView2.Navigate("http://127.0.0.1:5173/");
            }
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Ошибка инициализации RelayTunnel: {ex.Message}", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private void OnWebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        try
        {
            using var doc = JsonDocument.Parse(e.WebMessageAsJson);
            var root = doc.RootElement;
            if (root.TryGetProperty("action", out var actionProp))
            {
                string action = actionProp.GetString() ?? "";
                switch (action)
                {
                    case "minimize":
                        WindowState = FormWindowState.Minimized;
                        break;
                    case "close":
                        CloseApp();
                        break;
                    case "drag":
                        ReleaseCapture();
                        SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
                        break;
                }
            }
        }
        catch { }
    }

    private void ShowAndRestore()
    {
        Show();
        WindowState = FormWindowState.Normal;
        BringToFront();
        Activate();
    }

    private void CloseApp()
    {
        _trayIcon.Visible = false;
        _trayIcon.Dispose();
        Application.Exit();
    }

    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        _trayIcon.Visible = false;
        _trayIcon.Dispose();
        base.OnFormClosing(e);
    }
}
