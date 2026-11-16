<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\General;
use Illuminate\Http\Request;

class CategoryController extends BasicController
{
    public $model = Category::class;
    public $reactView = 'Admin/Categories';
    public $imageFields = ['image', 'banner_desktop', 'banner_mobile'];

    public function setReactViewProperties(Request $request)
    {
        $catalogBanner = General::where('correlative', 'catalog_banner')->value('description') ?? '';
        $catalogBannerMobile = General::where('correlative', 'catalog_banner_mobile')->value('description') ?? '';

        return [
            'catalogBanner' => $catalogBanner,
            'catalogBannerMobile' => $catalogBannerMobile,
        ];
    }
}
