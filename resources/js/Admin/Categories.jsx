import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Table';
import Modal from '../Components/Modal';
import ReactAppend from '../Utils/ReactAppend';
import DxButton from '../Components/dx/DxButton';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import Swal from 'sweetalert2';
import InputFormGroup from '../Components/form/InputFormGroup';
import CategoriesRest from '../Actions/Admin/CategoriesRest';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import GalleryRest from '../Actions/Admin/GalleryRest';
import GeneralsRest from '../Actions/Admin/GeneralsRest';

const categoriesRest = new CategoriesRest()
const galleryRest = new GalleryRest()
const generalsRest = new GeneralsRest()

const Categories = ({ catalogBanner: initialCatalogBanner = '', catalogBannerMobile: initialCatalogBannerMobile = '' }) => {

  const gridRef = useRef()
  const modalRef = useRef()
  const bannerModalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const nameRef = useRef()
  const descriptionRef = useRef()
  const imageRef = useRef();
  const bannerDesktopRef = useRef();
  const bannerMobileRef = useRef();

  // Banner general refs y estados
  const bannerGeneralDesktopRef = useRef()
  const bannerGeneralMobileRef = useRef()
  const [currentGeneralBanner, setCurrentGeneralBanner] = useState(initialCatalogBanner)
  const [currentGeneralBannerMobile, setCurrentGeneralBannerMobile] = useState(initialCatalogBannerMobile)

  const [isEditing, setIsEditing] = useState(false)

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    nameRef.current.value = data?.name ?? ''
    descriptionRef.current.value = data?.description ?? ''

    if (imageRef.current) {
        imageRef.current.value = ""; 
        if (data?.image) {
            if(imageRef.image) imageRef.image.src = `/api/category/media/${data?.image}`;
        } else {
            if(imageRef.image) imageRef.image.src = "/api/category/thumbnail/null"; 
        }
    }

    if (bannerDesktopRef.current) {
        bannerDesktopRef.current.value = "";
        if (data?.banner_desktop) {
            if(bannerDesktopRef.image) bannerDesktopRef.image.src = `/api/category/media/${data?.banner_desktop}`;
        } else {
            if(bannerDesktopRef.image) bannerDesktopRef.image.src = "/api/category/thumbnail/null";
        }
    }

    if (bannerMobileRef.current) {
        bannerMobileRef.current.value = "";
        if (data?.banner_mobile) {
            if(bannerMobileRef.image) bannerMobileRef.image.src = `/api/category/media/${data?.banner_mobile}`;
        } else {
            if(bannerMobileRef.image) bannerMobileRef.image.src = "/api/category/thumbnail/null";
        }
    }

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      description: descriptionRef.current.value,
    }

    const formData = new FormData();
    
    for (const key in request) {
        formData.append(key, request[key]);
    }

    const file = imageRef.current?.files?.[0];
    if (file) {
        formData.append("image", file);
    }

    const fileBannerDesktop = bannerDesktopRef.current?.files?.[0];
    if (fileBannerDesktop) {
        formData.append("banner_desktop", fileBannerDesktop);
    }

    const fileBannerMobile = bannerMobileRef.current?.files?.[0];
    if (fileBannerMobile) {
        formData.append("banner_mobile", fileBannerMobile);
    }
      
    const result = await categoriesRest.save(formData)
  
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onBannerModalOpen = () => {
    if (bannerGeneralDesktopRef.current) {
      bannerGeneralDesktopRef.current.value = "";
      if (currentGeneralBanner && bannerGeneralDesktopRef.image) {
        bannerGeneralDesktopRef.image.src = `/api/generals/media/${currentGeneralBanner}`;
      } else if (bannerGeneralDesktopRef.image) {
        bannerGeneralDesktopRef.image.src = "/assets/img/frascos_y_botellas.webp";
      }
    }

    if (bannerGeneralMobileRef.current) {
      bannerGeneralMobileRef.current.value = "";
      if (currentGeneralBannerMobile && bannerGeneralMobileRef.image) {
        bannerGeneralMobileRef.image.src = `/api/generals/media/${currentGeneralBannerMobile}`;
      } else if (bannerGeneralMobileRef.image) {
        bannerGeneralMobileRef.image.src = "/assets/img/frascos_y_botellas.webp";
      }
    }

    $(bannerModalRef.current).modal('show');
  }

  const onBannerModalSubmit = async (e) => {
    e.preventDefault();

    let newDesktop = currentGeneralBanner;
    let newMobile = currentGeneralBannerMobile;

    const fileDesktop = bannerGeneralDesktopRef.current?.files?.[0];
    if (fileDesktop) {
      const fd = new FormData();
      fd.append('image', fileDesktop);
      const res = await galleryRest.save(fd);
      if (res?.file) {
        newDesktop = res.file;
      }
    }

    const fileMobile = bannerGeneralMobileRef.current?.files?.[0];
    if (fileMobile) {
      const fd = new FormData();
      fd.append('image', fileMobile);
      const res = await galleryRest.save(fd);
      if (res?.file) {
        newMobile = res.file;
      }
    }

    const payload = [
      {
        correlative: 'catalog_banner',
        name: 'Banner General del Catálogo',
        description: newDesktop || ''
      },
      {
        correlative: 'catalog_banner_mobile',
        name: 'Banner General del Catálogo (Móvil)',
        description: newMobile || ''
      }
    ];

    const result = await generalsRest.save(payload);
    if (result) {
      setCurrentGeneralBanner(newDesktop);
      setCurrentGeneralBannerMobile(newMobile);
      Swal.fire({
        icon: 'success',
        title: 'Banners actualizados',
        text: 'Los banners del catálogo general se guardaron correctamente',
        timer: 1500,
        showConfirmButton: false
      });
      $(bannerModalRef.current).modal('hide');
    }
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await categoriesRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar registro',
      text: '¿Estas seguro de eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await categoriesRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title='Categorías' rest={categoriesRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
          }
        });
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'image',
            text: 'Banner Catálogo General',
            hint: 'Modificar banner del catálogo general',
            onClick: () => onBannerModalOpen()
          }
        });
      }}
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
          dataField: 'name',
          caption: 'Categoría',
          width: '30%',
        },
        {
          dataField: 'description',
          caption: 'Descripción',
          width: '50%',
        },
        {
          dataField: 'visible',
          caption: 'Visible',
          dataType: 'boolean',
          cellTemplate: (container, { data }) => {
            $(container).empty()
            ReactAppend(container, <SwitchFormGroup checked={data.visible == 1} onChange={() => onVisibleChange({
              id: data.id,
              value: !data.visible
            })} />)
          }
        },
        {
          caption: 'Acciones',
          cellTemplate: (container, { data }) => {
            container.css('text-overflow', 'unset')
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-primary',
              title: 'Editar',
              icon: 'fa fa-pen',
              onClick: () => onModalOpen(data)
            }))
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-danger',
              title: 'Eliminar',
              icon: 'fa fa-trash',
              onClick: () => onDeleteClicked(data.id)
            }))
          },
          allowFiltering: false,
          allowExporting: false
        }
      ]} />
    <Modal modalRef={modalRef} title={isEditing ? 'Editar categoría' : 'Agregar categoría'} onSubmit={onModalSubmit} size='lg'>
      <div className='row' id='faqs-container'>
        
        <input ref={idRef} type='hidden' />
        
        <InputFormGroup 
            eRef={nameRef} 
            label='Categoría' 
            col='col-12' required 
        />

        <TextareaFormGroup 
            eRef={descriptionRef} 
            label='Descripción' 
            rows={3} 
        />

        <div className='col-12 my-2'>
          <h5 className='text-muted mb-1'>Imágenes de la Categoría</h5>
          <hr className='mt-0 mb-3' />
        </div>

        <ImageFormGroup
              eRef={imageRef}
              label="Imagen de tarjeta (Listados)"
              col="col-12 col-md-4"
              aspect={3/2}
              fit="contain"
        />

        <ImageFormGroup
              eRef={bannerDesktopRef}
              label="Banner Catálogo (Desktop)"
              col="col-12 col-md-4"
              aspect={21/9}
              fit="cover"
        />

        <ImageFormGroup
              eRef={bannerMobileRef}
              label="Banner Catálogo (Mobile)"
              col="col-12 col-md-4"
              aspect={16/9}
              fit="cover"
        />
      </div>
    </Modal>

    <Modal modalRef={bannerModalRef} title='Banner del Catálogo General' onSubmit={onBannerModalSubmit} size='lg'>
      <div className='row'>
        <div className='col-12 mb-3'>
          <p className='text-muted'>
            Configura las imágenes de fondo que aparecerán en la cabecera de la página de catálogo general (<code>/catalogo</code>).
          </p>
        </div>

        <ImageFormGroup
          eRef={bannerGeneralDesktopRef}
          label="Banner Catálogo General (Desktop)"
          col="col-12 col-md-6"
          aspect={21/9}
          fit="cover"
        />

        <ImageFormGroup
          eRef={bannerGeneralMobileRef}
          label="Banner Catálogo General (Mobile)"
          col="col-12 col-md-6"
          aspect={16/9}
          fit="cover"
        />
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {

  createRoot(el).render(<BaseAdminto {...properties} title='Categorías'>
    <Categories {...properties} />
  </BaseAdminto>);
})