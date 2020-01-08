<template>
<b-card @click.prevent="toggleItem($event,data.id)" :class="{'d-flex flex-row':true,'active' : selectedItems.includes(data.id)}" no-body>
    <div class="pl-2 d-flex flex-grow-1 min-width-zero">
        <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
            <router-link :to="`?p=${data.id}`" class="w-40 w-sm-100">
                <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.membershipCode}}</p>
                <p class="list-item-heading mb-0 truncate">{{data.firstName}} {{data.lastName}}</p>
                <p class="list-item-heading mb-0 truncate">{{data.referenceNumber}}</p>
            </router-link>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.emailAddress}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.entryType}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.paymentAmount}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.performedBy.membershipCode}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.phoneNumber}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.clearedBalance}}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.createdAt }}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.transactionType }}</p>
            <p class="mb-0 text-muted text-small w-15 w-sm-100">{{data.transactionStatus }}</p>
            <div class="w-15 w-sm-100" v-if="data.phoneVerified === true || data.phoneVerified === false">
                <b-badge pill :variant="data.statusColor">Verified: {{ data.phoneVerified }}</b-badge>
            </div>
            <div class="w-15 w-sm-100" v-if="data.approvedMembership === true || data.approvedMembership === false">
                <b-badge pill :variant="data.statusColor">Approved:{{ data.approvedMembership }}</b-badge>
            </div>
            <div class="w-15 w-sm-100" v-if="data.canInvest === true || data.canInvest === false">
                <b-badge pill :variant="data.statusColor">Investment: {{ data.canInvest }}</b-badge>
            </div>
        </div>
        <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
            <b-form-checkbox :checked="selectedItems.includes(data.id)" class="itemCheck mb-0" />
        </div>
    </div>
</b-card>
</template>

<script>
export default {
    props: ['data', 'selectedItems'],
    methods: {
        toggleItem(event, itemId) {
            this.$emit('toggle-item', event, itemId)
        }
    }
}
</script>
