<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <!-- Styles / Scripts -->
    @vite([
    /*'resources/css/app.css',
    'resources/sass/app.scss',
    'resources/js/app.js',*/
    'pakages/alexmes/adminpanel/src/public/sass/app.scss',
    'pakages/alexmes/adminpanel/src/public/css/app.css',
    'pakages/alexmes/adminpanel/src/public/js/app.js'
    ])
    {{--<script type="module" src="/vendor/adminpanel/js/app.js"></script>--}}
    <title>Pakage - dbDasher</title>
</head>
<body>
    <div id="app">
        @yield('content')
    </div>
</body>
</html>
