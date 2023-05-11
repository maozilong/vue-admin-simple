
const components = {
  MForm: () => import('@/components/MForm/index'),
  MUpload: () => import('@/components/MUpload/index'),
  MTable: () => import('@/components/MTable/index'),
  FormModal: () => import('@/components/FormModal/index'),
  DragDialog: () => import('@/components/DragDialog/index'),
  MDropdown: () => import('@/components/MDropdown/index'),
  Operation: () => import('@/components/Operation/index'),
  Page: () => import('@/components/Page/index')
}

export default function(vue) {
  Object.entries(components).forEach(([key, fn]) => {
    vue.component(key, fn)
  })
}

