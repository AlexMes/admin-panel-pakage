<?php

namespace alexmes\adminpanel\Providers;

use Illuminate\Support\ServiceProvider;

class AdminPanelServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/adminpanel.php');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'adminpanel');
        $this->publishes([
            __DIR__.'/../public' => public_path('vendor/adminpanel'),
        ], 'public');
    }
}
