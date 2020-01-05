<template>
    <b-card @click="toggleItem($event,data.id)" :class="{'d-flex mb-3':true,'active' : selectedItems.includes(data.id)}" no-body>
        <div class="d-flex flex-grow-1 min-width-zero">
            <b-card-body class="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center pb-2">
                <a :href="`/app/settings/security/role/${data.id}`" class="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1" >
                    <i :class="{'heading-icon':true,
                                'simple-icon-check' :data.enabled === true,
                                'simple-icon-refresh' :data.enabled !== true
                            }"/>
                    <span class="align-middle d-inline-block">{{data.description}}</span>
                </a>
                <p class="mb-1 text-muted text-small w-15 w-xs-100">{{data.name}}</p>
            </b-card-body>
            <div class="custom-control custom-checkbox pl-1 align-self-center mr-4 pt-sm-4 custom-control custom-checkbox pl-1 align-self-md-center align-self-start pt-4">
                <b-form-checkbox :checked="selectedItems.includes(data.id)" class="itemCheck mb-0"/>
            </div>
        </div>
    </b-card>
</template>

<script>
export default {
  props: ['data', 'selectedItems'],
  methods: {
    toggleItem (event, itemId) {
      this.$emit('toggle-item', event, itemId)
    }
  }
}
</script>
