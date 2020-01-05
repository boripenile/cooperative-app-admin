<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('configuration.upload-center')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    
    <b-row>
      
      <b-modal id="modalUserRegistration" ref="modalUserRegistration" :title="$t('user.users-preview')" size="lg"
      >
      <b-form>
        <div class="top-right-button-container">
        <b-button-group>
        <b-button variant="primary" size="lg" class="top-right-button">{{ this.usersTable.selected.length }} selected</b-button>
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
          <b-dropdown-item @click="registerUsers">{{$t('user.bulk-registration')}}</b-dropdown-item>
        </b-dropdown>
      </b-button-group>
      </div>
        <b-table responsive
            ref="custom-table"
            class="vuetable"
            sort-by="title" sort-desc.sync="false"
            @row-selected="rowSelected"
            selectable
            :select-mode="usersTable.selectMode"
            :current-page="currentPage"
            selectedVariant="primary"
            :fields="usersTable.fields"
            :items="users"
          >
          <template slot="status" slot-scope="data">
            <b-badge class="mb-1" :variant="data.item.statusColor">{{ data.value }}</b-badge>
          </template>
          </b-table>
      </b-form>
      <template slot="modal-footer">
        <b-button variant="outline-secondary" @click="hideModal('modalUserRegistration')">{{ $t('user.discard') }}</b-button>
        <b-button variant="primary" @click="registerUsers" class="mr-1">{{ $t('user.bulk-registration') }}</b-button>
      </template>
    </b-modal>
      
      
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="$t('upload-center.user-upload')">
          <b-form>
            <b-row>
              <b-colxx xxs="12">
                <vue-dropzone ref="usersDropzone" id="usersDropzone" :options="usersUploadOptions" @vdropzone-success="afterUserUploadProcessed"></vue-dropzone>
              </b-colxx>
            </b-row>
          </b-form>
        </b-card>
      </b-colxx>
    </b-row>

    <application-menu>
      <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }"  >
        <div class="p-4">
          <p class="text-muted text-small mb-3">{{$t('upload-center.user-instructions')}}</p>
          <br/>
            <p class="text-muted text-small mb-1">{{$t('upload-center.contribution-instructions')}}</p>
            <br/>
            <div>
              
            </div>
        </div>
      </vue-perfect-scrollbar>
    </application-menu>
  </div>
</template>
<script>
import axios from 'axios'
import ApplicationMenu from '../../../../components/Common/ApplicationMenu'
import { apiBaseUrl } from '../../../../constants/config'
import VueDropzone from 'vue2-dropzone'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../../components/Common/VuetablePaginationBootstrap'
import Axios from 'axios'
import { tokenExpired } from '../../../../utils'

export default {
  components: {
    'v-select' : vSelect,
    'vue-dropzone' : VueDropzone,
    'application-menu': ApplicationMenu,
    'vuetable' : Vuetable,
    'vuetable-pagination-bootstrap' : VuetablePaginationBootstrap
  },
  data () {
    return {
      user: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
      token: null,
      messageTitle: 'User Registration',
      users: [],
      currentPage: 1,
      perPage: 3,
      totalRows: 0,
      usersTable: {
        selected: [],
        selectMode: 'multi',
        fields: [
          { key: 'firstName', label: 'First Name', sortable: true, sortDirection: 'desc', tdClass: 'list-item-heading' },
          { key: 'lastName', label: 'Last Name', sortable: true, tdClass: 'text-muted' },
          { key: 'username', label: 'Username', sortable: true, tdClass: 'text-muted' },
          { key: 'emailAddress', label: 'Email Address', sortable: true, tdClass: 'text-muted' },
          { key: 'phoneNumber', label: 'Phone Number', sortable: true, tdClass: 'text-muted' },
          { key: 'referralCode', label: 'Referral Code', sortable: true, tdClass: 'text-muted' }
        ]
      },
      users: [],
      usersUploadOptions: {
        url: apiBaseUrl + '/users/process/userfile',
        thumbnailHeight: 160,
        maxFilesize: 2,
        previewTemplate: this.dropzoneTemplate(),
        headers: { 'Authorization': this.token }
      }
    }
  },
  mounted () {
    this.token = 'Bearer ' + this.user.token
  },
  methods: {
    afterUserUploadProcessed (file, response) {
      if (response.data !== null && response.data.length > 0) {
        this.users = response.data
        this.currentPage = 1
        this.perPage = 3
        this.totalRows = this.users.length
        this.showModal('modalUserRegistration')
      }
    },
    addNotification (
      type = 'success',
      title = 'This is Notify Title',
      message = 'This is Notify Message,<br>with html.'
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false })
    },
    isSelectedAll () {
      return this.usersTable.selected.length >= this.users.length
    },
    isAnyItemSelected () {
      return this.usersTable.selected.length > 0 && this.usersTable.selected.length < this.users.length
    },
    selectAll (isToggle) {
      if (this.usersTable.selected.length >= this.users.length) {
        if (isToggle) { 
          this.usersTable.selected = [] 
        }
      } else {
        this.usersTable.selected = this.users.map(x => x)
      }
    },
    keymap (event) {
      switch (event.srcKey) {
        case 'select':
          this.selectAll(false)
          break
        case 'undo':
          this.usersTable.selected = []
          break
      }
    },
    registerUsers () {
      if (this.usersTable.selected.length === 0) {
        this.addNotification('info', this.messageTitle, 'Select atleast a user to proceed.')
      } else {
        const usersSelected = this.usersTable.selected
        for(var index = 0; index < usersSelected.length; index++) {
          const itemIndex = this.users.indexOf(usersSelected[index])
          const userToRegister = usersSelected[index]
          if (itemIndex != -1) {
            this.registerUser(userToRegister, itemIndex)
          }
        }
      }
    },
    registerUser (data, idx) {
      axios.post(apiBaseUrl + '/register', data, {
        headers: {
          'Authorization': this.token
        }
      })
      .then(r => r.data)
      .then(res => {
        console.log(JSON.stringify(res))
        this.addNotification('success', this.messageTitle, res.data)
        this.users.splice(idx, 1)
        console.log('Total users left: ' + this.users.length)
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.$notify('info', 'Token Expired', 'Please login again', { duration: 3000, permanent: false })
          this.$router.push('/user/login')
        } else {
          console.log(err.response.data)
          this.addNotification('error', this.messageTitle, err.response.data.message)
        }
      })
    },
    rowSelected (items) {
      this.usersTable.selected = items
    },
    hideModal (refname) {
      this.$refs[refname].hide()
    },
    showModal (refname) {
      this.$refs[refname].show()
    },
    dropzoneTemplate () {
      return `<div class="dz-preview dz-file-preview mb-3">
                  <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                      <div class="preview-container">
                        <img data-dz-thumbnail class="img-thumbnail border-0" />
                        <i class="simple-icon-doc preview-icon"></i>
                      </div>
                  </div>
                  <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div> <span data-dz-name /> </div>
                    <div class="text-primary text-extra-small" data-dz-size /> </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  </div>
                  <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
                </div>
        `
    }
  }
}
</script>
