<?php

namespace MicroweberPackages\Marketplace\Http\Livewire\Admin;

use Livewire\Component;
use MicroweberPackages\Package\MicroweberComposerClient;

class Marketplace extends Component
{
    public $keyword = '';
    public $marketplace = [];
    public $category = 'microweber-template';

    public $queryString = [
        'keyword',
        'category'
    ];

    public function updatedKeyword($keyword)
    {
        $this->filter();
    }

    public function filterCategory($category)
    {
        $this->category = $category;
        $this->filter();
    }

    public function mount()
    {
        $this->filter();
    }

    public function reloadPackages()
    {
        $this->filter();
    }

    public function filter()
    {
        $marketplace = new MicroweberComposerClient();
        $packages = $marketplace->search();
        $latestVersions = [];
        foreach ($packages as $packageName=>$package) {
            $latestVersionPackage = end($package);
            if (!empty($this->category)) {
                if ($latestVersionPackage['type'] != $this->category) {
                    continue;
                }
            }

            $searchKeywords = [];
            if (isset($latestVersionPackage['keywords']) && is_array($latestVersionPackage['keywords'])) {
                $searchKeywords = array_merge($searchKeywords, $latestVersionPackage['keywords']);
            }

            if (isset($latestVersionPackage['extra']['categories']) && is_array($latestVersionPackage['extra']['categories'])) {
                $searchKeywords = array_merge($searchKeywords, $latestVersionPackage['extra']['categories']);
            }

            if (!empty($this->keyword)) {
                $founded = false;
                if (in_array($this->keyword, $searchKeywords)) {
                    $founded = true;
                }
                if (isset($latestVersionPackage['description'])) {
                    if (mb_strpos($latestVersionPackage['description'], $this->keyword) !== false) {
                        $founded = true;
                    }
                }
                if (!$founded) {
                    continue;
                }
            }

            $latestVersions[$packageName] = $latestVersionPackage;
        }

        $this->marketplace = $latestVersions;
    }

    public function render()
    {
        return view('marketplace::admin.marketplace.livewire.index');
    }
}
