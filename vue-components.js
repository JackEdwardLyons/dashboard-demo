new Vue({
    el:  '#vue-app',
    data: function() {
        return {
            name: 'John',
            shipments: 4,
            loading: false
        }
    },
    computed: {
        helloMsg() {
            return 'Hello, ' + this.name + '. You have ' + this.shipments + ' shipments.';
        }
    },
    mounted: function() {
        this.loading = true;
        var self = this;
        setTimeout(function() {
            self.loading = false;
        }, 2000)
    }
})