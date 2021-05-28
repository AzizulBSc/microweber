<?php
namespace MicroweberPackages\Blog\FrontendFilter\Traits;

use Illuminate\Support\Facades\URL;
use MicroweberPackages\Category\Models\Category;

trait PaginationTrait {

    protected $pagination;

    public function pagination($theme = false)
    {
        //$filteringTheResults = get_option('filtering_the_results', $this->params['moduleId']);

        return $this->pagination->links($theme);
    }

    public function total()
    {
        return $this->pagination->total();
    }

    public function count()
    {
        return $this->pagination->count();
    }

    public function items()
    {
        return $this->pagination->items();
    }

    public function results()
    {
        return $this->pagination->items();
    }

    public function applyQueryPage($request)
    {
        $page = $request->get('page', false);
        if ($page) {
            $this->queryParams['page'] = $page;
        }
    }
}
