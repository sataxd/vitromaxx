import React from "react";
import { createRoot } from "react-dom/client";
import Base from "./components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";

import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import ProductFilter from "./components/Tailwind/Products/ProductFilter";
import { motion } from 'framer-motion';
import { CarritoProvider } from "./context/CarritoContext";

const CatalogProducts = ({
    sliders,
    items,
    categories,
    supplies,
    testimonies,
    anuncio,
    initialCategory,    
    initialSubcategory,
    categorySelected,
    catalogBanner,
    catalogBannerMobile,
    showSlogan = true,
}) => {
    
    const pageTitle = initialSubcategory || initialCategory || "Catálogo";

    // Si está en una categoría y tiene banner específico, se usa ese; de lo contrario, el banner general o el default
    const desktopBannerSrc = categorySelected?.banner_desktop
        ? `/api/category/media/${categorySelected.banner_desktop}`
        : (catalogBanner ? `/api/generals/media/${catalogBanner}` : "/assets/img/frascos_y_botellas.webp");

    const mobileBannerSrc = categorySelected?.banner_mobile
        ? `/api/category/media/${categorySelected.banner_mobile}`
        : (catalogBannerMobile ? `/api/generals/media/${catalogBannerMobile}` : desktopBannerSrc);

    return (
        <>
            <Header />

            <div className="mt-[70px] w-full">
                <picture className="w-full block">
                    <source media="(max-width: 640px)" srcSet={mobileBannerSrc} />
                    <img 
                        className="w-full h-auto block" 
                        src={desktopBannerSrc}
                        alt={pageTitle}
                        onError={(e) => { e.currentTarget.src = "/assets/img/frascos_y_botellas.webp"; }}
                    />
                </picture>
            </div>

            <div className="relative z-10">
                
                <ProductFilter
                    products={items}
                    categories={categories}
                    anuncio={anuncio}
                    initialCategory={initialCategory}      
                    initialSubcategory={initialSubcategory}
                />

            </div>

            <Footer />
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <CatalogProducts {...properties} />
            </Base>
        </CarritoProvider>
    );
});
