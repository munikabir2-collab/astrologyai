import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const AstroAIApp());
}

class AstroAIApp extends StatelessWidget {
  const AstroAIApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'AstroAI',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
        ),
        useMaterial3: true,
      ),
      home: const AstroAIWebView(),
    );
  }
}

class AstroAIWebView extends StatefulWidget {
  const AstroAIWebView({super.key});

  @override
  State<AstroAIWebView> createState() => _AstroAIWebViewState();
}

class _AstroAIWebViewState extends State<AstroAIWebView> {
  late final WebViewController controller;

  bool canGoBack = false;
  bool isLoading = true;
  bool hasError = false;

  String errorMessage = '';

  @override
  void initState() {
    super.initState();

    controller = WebViewController()
      ..setJavaScriptMode(
        JavaScriptMode.unrestricted,
      )
      ..setBackgroundColor(
        Colors.white,
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            debugPrint('================================');
            debugPrint('WEBVIEW PAGE STARTED');
            debugPrint('URL: $url');
            debugPrint('================================');

            if (!mounted) return;

            setState(() {
              isLoading = true;
              hasError = false;
              errorMessage = '';
            });
          },

          onPageFinished: (String url) async {
            debugPrint('================================');
            debugPrint('WEBVIEW PAGE FINISHED');
            debugPrint('URL: $url');
            debugPrint('================================');

            final back = await controller.canGoBack();

            if (!mounted) return;

            setState(() {
              canGoBack = back;
              isLoading = false;
            });
          },

          onWebResourceError: (WebResourceError error) {
            debugPrint('================================');
            debugPrint('WEBVIEW ERROR');
            debugPrint('Error code: ${error.errorCode}');
            debugPrint('Description: ${error.description}');
            debugPrint('Error type: ${error.errorType}');
            debugPrint('URL: ${error.url}');
            debugPrint('================================');

            if (!mounted) return;

            setState(() {
              hasError = true;
              isLoading = false;
              errorMessage =
                  'Error ${error.errorCode}: ${error.description}';
            });
          },

          onNavigationRequest: (NavigationRequest request) {
            debugPrint(
              'WEBVIEW NAVIGATION REQUEST: ${request.url}',
            );

            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(
        Uri.parse(
          'https://astrologyai-s2y5.onrender.com',
        ),
      );
  }

  Future<void> reloadPage() async {
    if (!mounted) return;

    setState(() {
      hasError = false;
      isLoading = true;
      errorMessage = '';
    });

    await controller.reload();
  }

  Future<void> handleBack() async {
    if (await controller.canGoBack()) {
      await controller.goBack();

      if (!mounted) return;

      final back = await controller.canGoBack();

      setState(() {
        canGoBack = back;
      });
    } else {
      if (mounted) {
        Navigator.of(context).pop();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: !canGoBack,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) {
          return;
        }

        await handleBack();
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SafeArea(
          child: Stack(
            children: [
              WebViewWidget(
                controller: controller,
              ),

              if (isLoading)
                const Center(
                  child: CircularProgressIndicator(),
                ),

              if (hasError)
                Container(
                  color: Colors.white,
                  width: double.infinity,
                  height: double.infinity,
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.wifi_off,
                            size: 64,
                            color: Colors.deepPurple,
                          ),

                          const SizedBox(height: 20),

                          const Text(
                            'Network Error',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),

                          const SizedBox(height: 12),

                          const Text(
                            'Unable to load AstroAI.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),

                          const SizedBox(height: 12),

                          Text(
                            errorMessage,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 13,
                              color: Colors.grey,
                            ),
                          ),

                          const SizedBox(height: 24),

                          ElevatedButton.icon(
                            onPressed: reloadPage,
                            icon: const Icon(Icons.refresh),
                            label: const Text('Try Again'),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
