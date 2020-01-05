<template>
  <div class="disable-text-selection">
    <b-row class="app-row survey-app" >
      <b-colxx xxs="12" key="roleDetail">
          <h1 v-if="currentRole" ><i :class="{'heading-icon':true,
                          'simple-icon-check' :currentRole.enabled === true,
                          'simple-icon-refresh' : currentRole.enabled !== true
                      }"/>
            <span class="align-middle d-inline-block pt-1">{{currentRole.name}}</span>
          </h1>
          <div class="top-right-button-container">
            <b-button-group>
              <b-button variant="outline-primary" size="lg" class="flex-grow-1 mr-1">{{ $t('role.actions') }}</b-button>
              <b-dropdown  right variant="outline-primary" toggle-class="spaced-content xs">
                <b-dropdown-item>{{$t('role.delete')}}</b-dropdown-item>
                <b-dropdown-item v-b-modal.modalright>{{$t('role.edit')}}</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
            <b-modal id="modalright" ref="modalright" :title="$t('role.edit-role-title')" class="modal-right">
              <b-form>
                <b-form-group :label="$t('role.name')">
                  <b-form-input v-model="currentRole.name"  />
                </b-form-group>
                <b-form-group :label="$t('role.description')">
                  <b-form-input v-model="currentRole.description"  />
                </b-form-group>
                <b-form-group :label="$t('role.status')">
                  <b-form-radio-group stacked class="pt-2" :options="statuses" v-model="currentRole.enabled" />
                </b-form-group>
              </b-form>
              <template slot="modal-footer">
                <b-button variant="outline-secondary" @click="hideModal('modalright')">{{ $t('role.cancel') }}</b-button>
                <b-button variant="primary" @click="updateItem()" class="mr-1">{{ $t('role.update') }}</b-button>
              </template>
            </b-modal>
            <b-modal id="modalperms" ref="modalperms" :title="$t('role.edit-role-title')" class="modal-right">
              <b-form>
                <b-form-group :label="$t('role.name')">
                  <b-form-input v-model="currentRole.name"  />
                </b-form-group>
                <b-form-group :label="$t('role.description')">
                  <b-form-input v-model="currentRole.description"  />
                </b-form-group>
                <b-form-group :label="$t('role.status')">
                  <b-form-radio-group stacked class="pt-2" :options="statuses" v-model="currentRole.enabled" />
                </b-form-group>
              </b-form>
              <template slot="modal-footer">
                <b-button variant="outline-secondary" @click="hideModal('modalperms')">{{ $t('role.cancel') }}</b-button>
                <b-button variant="primary" @click="updateItem()" class="mr-1">{{ $t('role.update') }}</b-button>
              </template>
            </b-modal>
            <b-modal id="modalpermissions" ref="modalpermissions" :title="$t('permission.add-new-title')" class="modal-right">
                <b-form>
                  <b-row>
                    <b-colxx xxs="12" md="12">
                      <b-form-group :label="$t('permission.multiple-permissions')">
                        <v-select v-model="vueSelectForm.multiple" multiple :options="selectData" 
                          :dir="direction"/>
                      </b-form-group>
                    </b-colxx>
                  </b-row>
                </b-form>
              <template slot="modal-footer">
                <b-button variant="outline-secondary" @click="hideModal('modalpermissions')">{{ $t('permission.cancel') }}</b-button>
                <b-button variant="primary" @click="updateRolePermissions()" class="mr-1">{{ $t('permission.update-permissions') }}</b-button>
              </template>
            </b-modal>
            <b-modal id="modalremovepermissions" ref="modalremovepermissions" :title="$t('permission.revoke-title')" class="modal-right">
                <b-form>
                  <b-row>
                    <b-colxx xxs="12" md="12">
                      <b-form-group :label="$t('permission.multiple-permissions')">
                        <v-select v-model="vueSelectForm.multipleDelete" multiple :options="permissions" 
                          :dir="direction"/>
                      </b-form-group>
                    </b-colxx>
                  </b-row>
                </b-form>
              <template slot="modal-footer">
                <b-button variant="outline-secondary" @click="hideModal('modalremovepermissions')">{{ $t('permission.cancel') }}</b-button>
                <b-button variant="danger" @click="removeRolePermissions()" class="mr-1">{{ $t('permission.delete-permissions') }}</b-button>
              </template>
            </b-modal>
          </div>
          <piaf-breadcrumb/>
          <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" v-model="tabIndex" :no-fade="true"  v-if="isLoadRoles" key="itemList">
            <b-tab :title="$t('role.details')" >
              <b-row>
              <b-colxx xxs="12" lg="4" class="mb-4">
                <b-card class="mb-4" no-body>
                    <b-card-body>
                      <p class="list-item-heading mb-4">{{$t('role.summary')}}</p>
                      <p class="text-muted text-small mb-2">{{$t('role.name')}}</p>
                      <p class="mb-3">{{currentRole.name}}</p>
                      <p class="text-muted text-small mb-2">{{$t('role.description')}}</p>
                      <p class="mb-3" v-html="currentRole.description"/>
                    </b-card-body>
                </b-card>
              </b-colxx>
              <b-colxx xxs="12" lg="8">
                <div class="text-center">
                    <b-button  v-b-modal.modalpermissions variant="outline-primary" class="mt-3"><i class="simple-icon-plus btn-group-icon" /> {{$t('role.add-permission')}}</b-button>
                    <b-button  v-b-modal.modalremovepermissions variant="outline-danger" class="mt-3"><i class="simple-icon-minus btn-group-icon" /> {{$t('role.remove-permission')}}</b-button>
                </div>
              </b-colxx>
              </b-row>
            </b-tab>
        </b-tabs>
        <div v-else class="loading" key="itemLoading"></div>
      </b-colxx>
    </b-row>
    <application-menu>
      <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }"  >
        <div class="p-4">
          <p class="text-muted text-small mb-3">{{$t('role.status')}}</p>
          <ul class="list-unstyled mb-4">
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-reload" />{{$t('role.all-roles')}} <span class="float-right" v-if="isLoadRoles">{{roleItems.length}}</span>
              </a></li>
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-refresh" />{{$t('role.suspend-roles')}} <span class="float-right" v-if="isLoadRoles">{{roleItems.filter(x => x.enabled === false).length}}</span>
              </a></li>
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-check" />{{$t('role.active-roles')}} <span class="float-right" v-if="isLoadRoles">{{roleItems.filter(x => x.enabled === true).length}}</span>
              </a></li>
          </ul>
            <p class="text-muted text-small mb-1" v-if="isLoadRoles">{{$t('role.assigned-permissions')}}</p>
            <br/>
            <div>
              <p class="d-sm-inline-block mb-1" v-for="(l,index) in currentRole.permissions" :key="index">
                <a href="#">
                  <b-badge pill :variant="`outline-info`" class="mb-1 mr-1">{{l.description.toUpperCase()}}</b-badge>
                </a>
              </p>
            </div>
        </div>
      </vue-perfect-scrollbar>
    </application-menu>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import DoughnutShadowChart from '../../../../../components/Charts/DoughnutShadow'
import { VueAutosuggest } from 'vue-autosuggest'
import VueDropzone from 'vue2-dropzone'
import InputTag from '../../../../../components/Form/InputTag'
import Draggable from 'vuedraggable'
import ApplicationMenu from '../../../../../components/Common/ApplicationMenu'
import { ThemeColors, getDirection } from '../../../../../utils'
import axios from 'axios'
import { apiBaseUrl } from '../../../../../constants/config'

const colors = ThemeColors()
export default {
  components: {
    'v-select' : vSelect,
    'vue-dropzone' : VueDropzone,
    'draggable' : Draggable,
    'doughnut-shadow-chart' : DoughnutShadowChart,
    'application-menu' : ApplicationMenu,
    'vue-autosuggest' : VueAutosuggest,
    'input-tag' : InputTag,
  },
  data () {
    return {
      statuses: [
        { text: 'ACTIVE', value: true },
        { text: 'SUSPENDED', value: false }
      ],
      user: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
      currentRole: null,
      tabIndex: 0,
      roleId: this.$route.params.id,
      vueAutosuggestForm: {
        selected: {}
      },
      vueSelectForm: {
        single: '',
        multiple: [],
        multipleDelete: [] 
      },
      direction: getDirection().direction,
      selectData: [],
      allPermissions: [],
      permissions: []
    }
  },
  computed: {
    ...mapGetters(['isLoadRoles', 'roleItems', 'roleError'])
  },
  methods: {
    ...mapActions(['getRoleItems']),
    ...mapMutations(['addRoleItem']),
    updateRolePermissions () {
      if (this.vueSelectForm.multiple.length > 0) {
        const codes = this.vueSelectForm.multiple.filter(x => x.code)
        const permIds = []
        const roleIds = []
        for (var index = 0; index < codes.length; index++) {
          permIds[index] = codes[index].code
        }
        roleIds.push(this.roleId)
    
        axios
          .post(`${apiBaseUrl}/roles/permissions`, {
            'roleIds': roleIds,
            'permIds': permIds
          }, {
            headers: {
              'Authorization': 'Bearer ' + this.user.token
            }
          })
          .then(r => r.data)
          .then(res => {
            if (res.status === 200) {
              this.populateRolePermissions()
              this.getRoleItem(this.filterPermissions())
            }
          })
          .catch(err => console.log(err))

          this.hideModal('modalpermissions')
      }
    },
    removeRolePermissions () {
      if (this.vueSelectForm.multipleDelete.length > 0) {
        const codes = this.vueSelectForm.multipleDelete.filter(x => x.code)
        const permIds = []
        const roleIds = []
        for (var index = 0; index < codes.length; index++) {
          permIds[index] = codes[index].code
        }
        roleIds.push(this.roleId)
        axios
          .post(`${apiBaseUrl}/roles/permissions/remove`, {
            'roleIds': roleIds,
            'permIds': permIds
          }, {
            headers: {
              'Authorization': 'Bearer ' + this.user.token
            }
          })
          .then(r => r.data)
          .then(res => {
            if (res.status === 200) {
              this.populateRolePermissions()
              this.getRoleItem(this.filterPermissions())
            }
          })
          .catch(err => console.log(err))

          this.hideModal('modalremovepermissions')
      }
    },
    updateRoleItem () {
      axios
        .post(`${apiBaseUrl}/roles/${this.roleId}`, this.currentRole)
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            this.getRoleItem()
          }
        })
        .catch(err => console.log(err))
    },
    getRoleItem (callback) {
      axios
        .get(`${apiBaseUrl}/roles/search/${this.currentRole.name}`)
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            this.currentRole = res.data[0]
            if (callback) {
              callback()
            }
          }
        })
        .catch(err => console.log(err))
    },
    populateRolePermissions () {
      this.permissions = []
      for (var index = 0; index < this.currentRole.permissions.length; index++) {
         this.permissions.push({'code': this.currentRole.permissions[index].id, 
         'label': this.currentRole.permissions[index].description})
      }
    },
    filterPermissions () {
      this.selectData = []
      for (var index = 0; index < this.allPermissions.length; index++) {
        var exited = this.permissions.filter(x => x.code === this.allPermissions[index].id)[0]
        if (exited) {
          continue
        }
        this.selectData.push({'code': this.allPermissions[index].id, 
          'label': this.allPermissions[index].description})
      }
    },
    loadPermissions () {
      axios
        .get(`${apiBaseUrl}/permissions`, {
          headers: {
            'Authorization': 'Bearer ' + this.user.token
          }
        })
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            this.allPermissions = res.data
            this.filterPermissions()
          }
        })
        .catch(err => console.log(err) )
    },
    updateItem () {
      this.updateRoleItem()
      this.hideModal('modalright')
    },
    onAutoSuggestInputChange (text, oldText) {
      if (text === null) {
        /* Maybe the text is null but you wanna do
         *  something else, but don't filter by null.
         */
        return
      }

      const filteredData = this.suggestions[0].data.filter(option => {
        return option.name.toLowerCase().indexOf(text.toLowerCase()) > -1
      })

      // Store data in one property, and filtered in another
      this.filteredOptions = [{ data: filteredData }]
    },

    onAutosuggestSelected (item) {
      this.vueAutosuggestForm.selected = item
    },
    renderSuggestion (suggestion) {
      const character = suggestion.item
      return character.name /* renderSuggestion will override the default suggestion template slot. */
    },
    getSuggestionValue (suggestion) {
      return suggestion.item.name
    },
    hideModal (refname) {
      this.$refs[refname].hide()
      this.filterPermissions(this.populateRolePermissions)
    },
    showModal (refname) {
      this.$refs[refname].show()
    }
  },
  mounted () {
    this.getRoleItems()
  },
  watch: {
    isLoadRoles (val) {
      if (val === true) {
        this.currentRole = this.roleItems.filter(x => x.id === this.roleId)[0]
        //if (this.allPermissions == null) {
          console.log('I am populating permissions')
          this.loadPermissions()
          this.populateRolePermissions()
        //}
      }
    }
  }
}
</script>
