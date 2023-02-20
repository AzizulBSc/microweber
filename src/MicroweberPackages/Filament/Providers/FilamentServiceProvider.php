<?php
/*
 * This file is part of the Microweber framework.
 *
 * (c) Microweber CMS LTD
 *
 * For full license information see
 * https://github.com/microweber/microweber/blob/master/LICENSE
 *
 */

namespace MicroweberPackages\Filament\Providers;


use Arcanedev\Support\Providers\ServiceProvider;
use Filament\Forms\FormsServiceProvider;
use Filament\Notifications\NotificationsServiceProvider;
use Illuminate\Support\Facades\View;


class FilamentServiceProvider extends ServiceProvider
{


    public function register()
    {
        $this->app->register(NotificationsServiceProvider::class);
        $this->app->register(FormsServiceProvider::class);
        $this->app->register(FilamentPackageServiceProvider::class);


        $originalFolder = new \ReflectionClass(\Filament\FilamentServiceProvider::class);
        $originalFolder = dirname(dirname($originalFolder->getFileName()));
        $originalViewsFolder = normalize_path($originalFolder.'/resources/views', true);
        $originalLangFolder = normalize_path($originalFolder.'/resources/lang', true);
        if(is_dir($originalViewsFolder)){
            View::addNamespace('filament', $originalViewsFolder);

        }

        if(is_dir($originalLangFolder)){
           $this->loadTranslationsFrom($originalLangFolder, 'filament');
        }




        $this->mergeConfigFrom(__DIR__ . '/../config/filament.php', 'filament');
        $this->mergeConfigFrom(__DIR__ . '/../config/notifications.php', 'notifications');
    }

}
