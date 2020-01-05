<template>
  <div class="disable-text-selection">
    <b-row class="app-row survey-app" >
      <b-colxx xxs="12">
          <h1>
            <span class="align-middle d-inline-block pt-1">{{ $t('configuration.global') }}</span>
          </h1>
          
          <piaf-breadcrumb/>
          <div class="separator mb-5"/>
          <b-row>
              <b-colxx xxs="12" lg="8" class="mb-8">
                <b-card class="question d-flex mb-4 edit-quesiton" no-body>
                    <div class="d-flex flex-grow-1 min-width-zero" >
                        <div class="card-body align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                            <div class="list-item-heading mb-0 truncate w-80 mb-1 mt-1">
                                <span class="heading-number d-inline-block">{{mandateConfig.sort}}</span>{{mandateConfig.name}} 
                                
                            </div>
                        </div>
                        <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                            <b-button variant="outline-theme-3" class="icon-button" @click="changeMandateMode('preview')"  v-if="mandateMode=='edit'">
                                <i class="simple-icon-eye"></i>
                            </b-button>
                            <b-button variant="outline-theme-3" class="icon-button" @click="changeMandateMode('edit')" v-if="mandateMode=='preview'">
                                <i class="simple-icon-pencil"></i>
                            </b-button>
                        </div>
                    </div>
                    <b-collapse :id="`${mandateConfig.sort}`" class="question-collapse" v-model="mandateShowDetail" >
                        <div class="card-body pt-0">
                            <b-form @submit.prevent="onUpdateMandateConfig">
                            <div v-if="mandateMode=='edit'" key="edit">
                                <div class="form-group has-top-label">
                                    <span>{{ $t('configuration.minimum-mandate') }}</span>
                                    <b-input type="number" v-model="mandateConfig.minimumMandate" :state="!$v.mandateConfig.minimumMandate.$invalid"/>
                                    <b-form-invalid-feedback>{{ $t('configuration.minimum-mandate-message')}}</b-form-invalid-feedback>
                                </div>
                                <div class="form-group mb-3">
                                    <b-form-checkbox v-model="mandateConfig.isMultiple">Is Minium mandate in multiple?</b-form-checkbox>
                                </div>
                                <div class="form-group has-top-label">
                                    <span>{{ $t('configuration.maximum-mandate') }}</span>
                                    <b-input type="number" v-model="mandateConfig.maximumMandate" :state="!$v.mandateConfig.maximumMandate.$invalid"/>
                                    <b-form-invalid-feedback>{{ $t('configuration.maximum-mandate-message')}}</b-form-invalid-feedback>
                                </div>
                                
                                <b-button type="submit" variant="primary" class="mt-3" :disabled="$v.mandateConfig.$invalid">{{ $t('configuration.update-setting') }}</b-button>
                            </div>
                            </b-form>
                        </div>
                    </b-collapse>
                </b-card>
              </b-colxx>
            </b-row>
            <b-row>
              <b-colxx xxs="12" lg="8" class="mb-8">
                <b-card class="question d-flex mb-4 edit-quesiton" no-body>
                    <div class="d-flex flex-grow-1 min-width-zero" >
                        <div class="card-body align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                            <div class="list-item-heading mb-0 truncate w-80 mb-1 mt-1">
                                <span class="heading-number d-inline-block">{{contributionConfig.sort}}</span>{{contributionConfig.name}} 
                                
                            </div>
                        </div>
                        <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                            <b-button variant="outline-theme-3" class="icon-button" @click="changeContributionMode('preview')"  v-if="contributionMode=='edit'">
                                <i class="simple-icon-eye"></i>
                            </b-button>
                            <b-button variant="outline-theme-3" class="icon-button" @click="changeContributionMode('edit')" v-if="contributionMode=='preview'">
                                <i class="simple-icon-pencil"></i>
                            </b-button>
                        </div>
                    </div>
                    <b-collapse :id="`${contributionConfig.sort}`" class="question-collapse" v-model="contributionShowDetail" >
                        <div class="card-body pt-0">
                            <b-form @submit.prevent="onUpdateContributionConfig">
                            <div v-if="contributionMode=='edit'" key="edit">
                                <div class="form-group has-top-label">
                                    <span>{{ $t('configuration.percentage-investment') }}</span>
                                    <b-input type="number" v-model="contributionConfig.percentageOfInvestment" :state="!$v.contributionConfig.percentageOfInvestment.$invalid"/>
                                    <b-form-invalid-feedback>{{ $t('configuration.percentage-investment-message')}}</b-form-invalid-feedback>                
                                </div>
                                <div class="form-group has-top-label">
                                    <span>{{ $t('configuration.percentage-savings') }}</span>
                                    <b-input type="number" v-model="contributionConfig.percentOfSavings" :state="!$v.contributionConfig.percentOfSavings.$invalid"/>
                                    <b-form-invalid-feedback>{{ $t('configuration.percentage-savings-message')}}</b-form-invalid-feedback>
                                </div>
                                <div class="form-group mb-3">
                                    <b-form-checkbox v-model="contributionConfig.sendSmsAfterApproval">Send sms to members after every approval?</b-form-checkbox>
                                </div>
                                <div class="form-group mb-3">
                                    <b-form-checkbox v-model="contributionConfig.sendSmsForOutstanding">Send sms to members for outstanding reminder?</b-form-checkbox>
                                </div>
                                <b-button type="submit" variant="primary" class="mt-3" :disabled="$v.contributionConfig.$invalid">{{ $t('configuration.update-setting') }}</b-button>
                            
                            </div>
                            </b-form>
                        </div>
                    </b-collapse>
                </b-card>
              </b-colxx>
            </b-row>
      </b-colxx>
    </b-row>
    
    <application-menu>
      <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }"  >
        <div class="p-4">
          <p class="text-muted text-small mb-3">{{$t('role.status')}}</p>
          <ul class="list-unstyled mb-4">
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-reload" />{{$t('role.all-roles')}} <span class="float-right"></span>
              </a></li>
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-refresh" />{{$t('role.suspend-roles')}} <span class="float-right"></span>
              </a></li>
            <li class="nav-item"><a href="#" >
                 <i class="simple-icon-check" />{{$t('role.active-roles')}} <span class="float-right"></span>
              </a></li>
          </ul>
            <p class="text-muted text-small mb-1">{{$t('role.assigned-permissions')}}</p>
            <br/>
            <div>
              
            </div>
        </div>
      </vue-perfect-scrollbar>
    </application-menu>
  </div>
</template>
<script>

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Draggable from 'vuedraggable'
import ApplicationMenu from '../../../../components/Common/ApplicationMenu'
import { apiBaseUrl } from '../../../../constants/config'
import axios from 'axios'
import { validationMixin } from 'vuelidate'
const { required } = require('vuelidate/lib/validators')

export default {
  components: {
    'v-select' :vSelect,
    'draggable' :Draggable,
    'application-menu' : ApplicationMenu,
  },
  data () {
    return {
      user: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
      mandateConfig: {
        name: 'Mandate Set',
        isMultiple: true,
        minimumMandate: 50000,
        maximumMandate: 500000,
        sort: 1
      },
      contributionConfig: {
        name: 'Contribution Set',
        percentageOfInvestment: 60,
        percentOfSavings: 40,
        sendSmsAfterApproval: true,
        sendSmsForOutstanding: true,
        sort: 2
      },
      mandateMode: 'preview', // edit,
      mandateShowDetail: false,
      contributionMode: 'preview',
      contributionShowDetail: false
    }
  },
  mixins: [validationMixin],
  validations: {
    mandateConfig: {
      minimumMandate: {
        required
      },
      maximumMandate: {
        required
      }
    },
    contributionConfig: {
      percentageOfInvestment: {
        required
      },
      percentOfSavings: {
        required
      }
    }
  },
  mounted () {
    this.loadConfigurations()
  },
  methods: {
    onUpdateMandateConfig () {
      console.log('Update Mandate Config')
    },
    onUpdateContributionConfig () {
      console.log('Update Contribution Config')
    },
    changeMandateMode (mode) {
      this.mandateMode = mode
      this.mandateShowDetail = true
    },
    changeContributionMode (mode) {
      this.contributionMode = mode
      this.contributionShowDetail = true
    },
    loadConfigurations () {
      axios.get(`${apiBaseUrl}/configurations`, {
        headers: {
          'Authorization': 'Bearer ' + this.user.token
        }
      }).then(r => r.data)
      .then(res => {
        if (res.status === 200) {
          const data = res.data[0]
          console.log(data)
          this.mandateConfig = data.mandateConfig
          this.mandateConfig.sort = 1
          this.contributionConfig = data.contributionConfig
          this.contributionConfig.sort = 2
        }
      }).catch(err => {
        console.log(err)
        if (err.response.status) {
        if (err.response.status === 401) {
            this.$router.push('/user/login')
        }
      }
        
        
      })
    }
  },
  watch: {
    mandateShowDetail (val) {
      if (!val) {
      }
    },
    contributionShowDetail (val) {
      if (!val) {
      }
    }
  }
}
</script>