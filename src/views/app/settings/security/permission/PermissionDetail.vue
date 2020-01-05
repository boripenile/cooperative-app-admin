<template>
  <div class="disable-text-selection">
    <b-row class="app-row survey-app" >
      <b-colxx xxs="12" key="permissionDetail">
          <h1 v-if="currentPermission" ><i :class="{'heading-icon':true,
                          'simple-icon-check' :currentPermission.enabled === true,
                          'simple-icon-refresh' : currentPermission.enabled !== true
                      }"/>
            <span class="align-middle d-inline-block pt-1">{{currentPermission.name}}</span>
          </h1>
          <div class="top-right-button-container">
            <b-button-group>
              <b-button variant="outline-primary" size="lg" class="flex-grow-1 mr-1">{{ $t('permission.actions') }}</b-button>
              <b-dropdown  right variant="outline-primary" toggle-class="spaced-content xs">
                <b-dropdown-item>{{$t('permission.delete')}}</b-dropdown-item>
                <b-dropdown-item v-b-modal.modalright>{{$t('permission.edit')}}</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
            <b-modal id="modalright" ref="modalright" :title="$t('permission.edit-permission-title')" class="modal-right">
              <b-form>
                <b-form-group :label="$t('permission.name')">
                  <b-form-input v-model="currentPermission.name"  />
                </b-form-group>
                <b-form-group :label="$t('permission.description')">
                  <b-form-input v-model="currentPermission.description"  />
                </b-form-group>
                <b-form-group :label="$t('permission.status')">
                  <b-form-radio-group stacked class="pt-2" :options="statuses" v-model="currentPermission.enabled" />
                </b-form-group>
              </b-form>
              <template slot="modal-footer">
                <b-button variant="outline-secondary" @click="hideModal('modalright')">{{ $t('permission.cancel') }}</b-button>
                <b-button variant="primary" @click="updateItem()" class="mr-1">{{ $t('permission.update') }}</b-button>
              </template>
            </b-modal>
          </div>
          <piaf-breadcrumb/>
          <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" v-model="tabIndex" :no-fade="true"  v-if="isLoadPermissions" key="itemList">
            <b-tab :title="$t('permission.details')" >
              <b-row>
              <b-colxx xxs="12" lg="6" class="mb-6">
                <b-card class="mb-4" no-body>
                    <b-card-body>
                      <p class="list-item-heading mb-4">{{$t('permission.summary')}}</p>
                      <p class="text-muted text-small mb-2">{{$t('permission.name')}}</p>
                      <p class="mb-3">{{currentPermission.name}}</p>
                      <p class="text-muted text-small mb-2">{{$t('permission.description')}}</p>
                      <p class="mb-3" v-html="currentPermission.description"/>
                    </b-card-body>
                </b-card>
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
          <p class="text-muted text-small mb-3">{{$t('permission.status')}}</p>
          <ul class="list-unstyled mb-4">
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-reload" />{{$t('permission.all-permissions')}} <span class="float-right" v-if="isLoadPermissions">{{permissionItems.length}}</span>
              </a></li>
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-refresh" />{{$t('permission.suspend-permissions')}} <span class="float-right" v-if="isLoadPermissions">{{permissionItems.filter(x => x.enabled === false).length}}</span>
              </a></li>
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-check" />{{$t('permission.active-permissions')}} <span class="float-right" v-if="isLoadPermissions">{{permissionItems.filter(x => x.enabled === true).length}}</span>
              </a></li>
          </ul>
            <p class="text-muted text-small mb-1" v-if="isLoadPermissions">{{$t('permission.permissions')}}</p>
        </div>
      </vue-perfect-scrollbar>
    </application-menu>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import DoughnutShadowChart from '../../../../../components/Charts/DoughnutShadow'
import Draggable from 'vuedraggable'
import ApplicationMenu from '../../../../../components/Common/ApplicationMenu'
import { ThemeColors } from '../../../../../utils'
import { apiBaseUrl } from '../../../../../constants/config'

const colors = ThemeColors()
export default {
  components: {
    'draggable' : Draggable,
    'doughnut-shadow-chart' : DoughnutShadowChart,
    'application-menu' : ApplicationMenu,
  },
  data () {
    return {
      statuses: [
        { text: 'ACTIVE', value: true },
        { text: 'SUSPENDED', value: false }
      ],
      currentPermission: null,
      tabIndex: 0,
      permissionId: this.$route.params.id
    }
  },
  computed: {
    ...mapGetters(['isLoadPermissions', 'permissionItems', 'permissionError', 'currentUser'])
  },
  methods: {
    ...mapActions(['getPermissionItems']),
    ...mapMutations(['addPermissionItem']),
    updatePermissionItem () {
      console.log(JSON.stringify(this.currentPermission))
      axios
        .post(`${apiBaseUrl}/permissions/${this.permissionId}`, this.currentPermission, {
          headers: {
            'Authorization': 'Bearer ' + this.currentUser.token
          }
        })
        .then(r => r.data)
        .then(res => {
          if (res.status === 200) {
            this.getPermissionItems()
          }
        })
        .catch(err => console.log(err) )
    },
    updateItem () {
      this.updatePermissionItem()
      this.hideModal('modalright')
    },
    hideModal (refname) {
      this.$refs[refname].hide()
    }
  },
  mounted () {
    this.getPermissionItems()
  },
  watch: {
    isLoadPermissions (val) {
      if (val === true) {
        this.currentPermission = this.permissionItems.filter(x => x.id === this.permissionId)[0]
      }
    }
  }
}
</script>
