<template>
  <div class="disable-text-selection">
    <b-row class="app-row survey-app" >
      <b-colxx xxs="12">
        <div class="mb-2">
          <h1>{{ $t('menu.permission') }}</h1>
          <div class="top-right-button-container">
            <b-button v-b-modal.modalright variant="primary" size="lg" class="top-right-button">{{ $t('permission.add-new') }}</b-button>
            <b-button-group v-if="isLoad">
              <b-dropdown  split right @click="selectAll(true)" class="check-button" variant="primary">
                  <label class="custom-control custom-checkbox pl-4 mb-0 d-inline-block" slot="button-content">
                    <input class="custom-control-input" type="checkbox"
                    :checked="isSelectedAll()"
                    v-shortkey="{select: ['ctrl','a'], undo: ['ctrl','d']}" @shortkey="keymap"
                    />
                    <span :class="{
                      'custom-control-label' :true,
                      'indeterminate' : isAnyItemSelected()
                    }">&nbsp;</span>
                  </label>
                <b-dropdown-item>{{$t('permission.delete')}}</b-dropdown-item>
                <b-dropdown-item>{{$t('permission.another-action')}}</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
            <b-modal id="modalright" ref="modalright" :title="$t('permission.add-new-title')" class="modal-right">
              <b-form>
                <b-form-group :label="$t('permission.name')">
                  <b-form-input v-model="newItem.name"  />
                </b-form-group>
                <b-form-group :label="$t('permission.description')">
                  <b-form-input v-model="newItem.description"  />
                </b-form-group>
                <b-form-group :label="$t('permission.status')">
                  <b-form-radio-group stacked class="pt-2" :options="statuses" v-model="newItem.enabled" />
                </b-form-group>
              </b-form>
              <template slot="modal-footer">
                <b-button variant="outline-secondary" @click="hideModal('modalright')">{{ $t('permission.cancel') }}</b-button>
                <b-button variant="primary" @click="addNewItem()" class="mr-1">{{ $t('permission.submit') }}</b-button>
              </template>
            </b-modal>
            
          </div>
          <piaf-breadcrumb/>
        </div>
        <div class="mb-2">
          <b-button variant="empty" class="pt-0 pl-0 d-inline-block d-md-none" v-b-toggle.displayOptions>
            {{ $t('permission.display-options') }} <i class="simple-icon-arrow-down align-middle" />
          </b-button>
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="d-block d-md-inline-block pt-1">
              <b-dropdown id="ddown1" :text="`${$t('permission.orderby')} ${sort.label}`" variant="outline-dark" class="mr-1 float-md-left btn-group " size="xs">
                  <b-dropdown-item v-for="(order,index) in sortOptions" :key="`order${index}`" @click="changeOrderBy(order)" >{{ order.label }}</b-dropdown-item>
              </b-dropdown>
              <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                <b-input :placeholder="$t('menu.search')" v-model="search"/>
              </div>
            </div>
            <div class="float-md-right pt-1">
                <span class="text-muted text-small mr-1 mb-2">{{from}}-{{to}} of {{ total }}</span>
                <b-dropdown id="ddown2" right :text="`${perPage}`" variant="outline-dark" class="d-inline-block" size="xs">
                    <b-dropdown-item v-for="(size,index) in pageSizes" :key="index" @click="changePageSize(size)">{{ size }}</b-dropdown-item>
                </b-dropdown>
            </div>
          </b-collapse>
        </div>
        <div class="separator mb-5"/>

        <b-row v-if="isLoad" key="itemList">
            <b-colxx xxs="12" v-for="(item,index) in permissionItems" :key="`item${index}`">
              <permission-list-item
                  :key="item.id"
                  :data="item"
                  :selected-items="selectedItems"
                  @toggle-item="toggleItem"
                  v-contextmenu:contextmenu
                />
            </b-colxx>
        </b-row>
        <div v-else class="loading" key="itemLoading"></div>
      </b-colxx>
    </b-row>
    <template v-if="isLoad">
            <b-row v-if="lastPage>1">
                <b-colxx xxs="12">
                    <b-pagination-nav :number-of-pages="lastPage" :link-gen="linkGen" v-model="page" :per-page="perPage" align="center">
                        <template v-slot:next-text>
                            <i class="simple-icon-arrow-right" />
                        </template>
                        <template v-slot:prev-text>
                            <i class="simple-icon-arrow-left" />
                        </template>
                        <template v-slot:first-text>
                            <i class="simple-icon-control-start" />
                        </template>
                        <template v-slot:last-text>
                            <i class="simple-icon-control-end" />
                        </template>
                    </b-pagination-nav>
                </b-colxx>
            </b-row>
        </template>
        <template v-else>
            <div class="loading"></div>
        </template>
    <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu">
      <v-contextmenu-item @click="onContextCopy()"><i class="simple-icon-docs" /> <span>Copy</span></v-contextmenu-item>
      <v-contextmenu-item @click="onContextArchive()"><i class="simple-icon-drawer" /> <span>Move to archive</span></v-contextmenu-item>
      <v-contextmenu-item @click="onContextDelete()"><i class="simple-icon-trash" /> <span>Delete</span></v-contextmenu-item>
    </v-contextmenu>

    <application-menu>
      <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }"  >
        <div class="p-4">
          <p class="text-muted text-small mb-3">{{$t('permission.status')}}</p>
          <ul class="list-unstyled mb-4">
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-reload" /><span class="d-inline-block">{{$t('permission.all-permissions')}}</span> <span class="float-right">{{permissionItems.length}}</span>
              </a></li>
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-refresh" />{{$t('permission.suspend-permissions')}} <span class="float-right">{{permissionItems.filter(x => x.enabled === false).length}}</span>
              </a></li>
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-check" /><span class="d-inline-block">{{$t('permission.active-permissions')}}</span> <span class="float-right">{{permissionItems.filter(x => x.enabled === true).length}}</span>
              </a></li>
          </ul>
        </div>

      </vue-perfect-scrollbar>
    </application-menu>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { apiBaseUrl } from '../../../../../constants/config'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import PermissionListItem from '../permission/PermissionListItems'
import ApplicationMenu from '../../../../../components/Common/ApplicationMenu'

export default {
  components: {
    'v-select' : vSelect,
    'permission-list-item' : PermissionListItem,
    'application-menu' :ApplicationMenu
  },
  data () {
    return {
      isLoad: false,
      apiBase: apiBaseUrl + '/permissions/pagination/search',
      sort: { column: 'name', label: 'Name' },
      sortOptions: [
        { column: 'name', label: 'Name' },
        { column: 'description', label: 'Description' },
        { column: 'enabled', label: 'Status' }
      ],
      search: '',
      selectedItems: [],
      page: 1,
      perPage: 4,
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      permissionItems: [],
      pageSizes: [2, 4, 8, 12],
      statuses: [
        { text: 'ACTIVE', value: true },
        { text: 'SUSPENDED', value: false }
      ],
      newItem: {
        name: '',
        description: '',
        enabled: ''
      }
    }
  },
  computed: {
    ...mapGetters (['currentUser']),
    apiUrl() {
        return `${this.apiBase}?sort=${this.sort.column}&page=${
        this.page
      }&per_page=${this.perPage}&search=${this.search}`
    }
  },
  methods: {
    ...mapMutations(['addPermissionItem']),
    loadItems() {
      this.isLoad = false
      console.log(this.currentUser)
      axios
        .get(this.apiUrl, {
          headers: {
            'Authorization': 'Bearer ' + this.currentUser.token
          }
        })
        .then(r => r.data)
        .then(res => {
          this.total = res.total
          this.from = res.from
          this.to = res.to
          this.permissionItems = res.data
          this.perPage = res.per_page
          this.selectedItems = []
          this.lastPage = res.last_page
          this.isLoad = true
        })
        .catch(err => {
            console.log(err)
        })
    },
    addPermissionItem () {
      console.log(JSON.stringify(this.newItem))
      var items = []
      items.push(this.newItem)
      console.log(JSON.stringify(items))
      axios
        .post(`${apiBaseUrl}/permissions`, items, {
          headers: {
            'Authorization': 'Bearer ' + this.currentUser.token
          }
        })
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            this.loadItems()
          }
        })
        .catch(err => console.log(err) )
    },
    isSelectedAll () {
      return this.selectedItems.length >= this.permissionItems.length
    },
    isAnyItemSelected () {
      return this.selectedItems.length > 0 && this.selectedItems.length < this.permissionItems.length
    },
    hideModal (refname) {
      this.$refs[refname].hide()
    },
    changeDisplayMode(displayType) {
      this.displayMode = displayType
    },
    changePageSize(perPage) {
      this.perPage = perPage
    },
    changeOrderBy(sort) {
      this.sort = sort
    },
    addNewItem () {
      const date = new Date()
      this.addPermissionItem()
      this.newItem = { name: '', description: '', enabled: '' }
      this.hideModal('modalright')
    },
    selectAll (isToggle) {
      if (this.selectedItems.length >= this.permissionItems.length) {
        if (isToggle) { this.selectedItems = [] }
      } else {
        this.selectedItems = this.permissionItems.map(x => x.id)
      }
    },
    keymap (event) {
      switch (event.srcKey) {
        case 'select':
          this.selectAll(false)
          break
        case 'undo':
          this.selectedItems = []
          break
      }
    },
    getIndex (value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i
        }
      }
      return -1
    },
    toggleItem (event, itemId) {
      if (event.shiftKey && this.selectedItems.length > 0) {
        let itemsForToggle = this.permissionItems
        var start = this.getIndex(itemId, itemsForToggle, 'id')
        var end = this.getIndex(this.selectedItems[this.selectedItems.length - 1], itemsForToggle, 'id')
        itemsForToggle = itemsForToggle.slice(Math.min(start, end), Math.max(start, end) + 1)
        this.selectedItems.push(
          ...itemsForToggle.map(item => {
            return item.id
          })
        )
      } else {
        if (this.selectedItems.includes(itemId)) {
          this.selectedItems = this.selectedItems.filter(x => x !== itemId)
        } else { this.selectedItems.push(itemId) }
      }
    },
    handleContextmenu (vnode) {
      if (!this.selectedItems.includes(vnode.key)) {
        this.selectedItems = [vnode.key]
      }
    },
    onContextCopy () {
      console.log('context menu item clicked - Copy Items: ', this.selectedItems)
    },
    onContextArchive () {
      console.log('context menu item clicked - Move to Archive Items: ', this.selectedItems)
    },
    onContextDelete () {
      console.log('context menu item clicked - Delete Items: ', this.selectedItems)
    },
    linkGen(pageNum) {
      return '#page-' + pageNum
    }
  },
  watch: {
      search() {
          this.page = 1
      },
      apiUrl() {
          this.loadItems()
      }
  },
  mounted () {
    this.loadItems()
  }
}
</script>
