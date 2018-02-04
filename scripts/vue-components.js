/* ----------------------------------------------------------------- *\
 * Vue JS
 * Lifecycle hooks: https://alligator.io/vuejs/component-lifecycle/
 * ----------------------------------------------------------------- */

// Notes:
// Potentially move data into a accordion-data-table component or 
// webpack compiled .vue files

/* ---- ACCORDION COMPONENT ---- */
Vue.component('vue-accordion-component', {
    template: '#vue-accordion-component',
    data: function () {
        return {
            username: 'John',
            loading: false,
            shipmentData: [],
            jsonFromTextArea: ''
        }
    },
    methods: {
        getBookingStatus() {
            return $.map(this.shipmentData, function (value, index) {
                if ( value.rejected.message ) {
                    value.bookingStatus = 'REJECTED';
                } else if ( $.isEmptyObject(value.rejected) && value.confirmation.CarrierReferenceNumber ) {
                    value.bookingStatus = 'CONFIRMED';
                } else if ( $.isEmptyObject(value.rejected) && value.confirmation.CarrierReferenceNumber === '' ) {
                    value.bookingStatus = 'PENDING' ;
                }  
                return value.bookingStatus;
            });
        },
        toggleShipmentData (id) {
            this.shipmentData[id].isOpen = !this.shipmentData[id].isOpen
        },
        cancelBooking (id) {
            this.shipmentData[id].isOpen = false;
            var self = this;
            swal({
                title: "Cancel this booking?",
                text: "Once cancelled, you will not be able to recover this booking",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                  swal("Your booking has been cancelled.", {
                    icon: "success",
                });
                  this.shipmentData[id].bookingStatus = 'CANCELLED';
                } else {
                  swal("Your booking remains.");
                }
            });
            this.shipmentData[id].isOpen = false;
        }
    },
    computed: {
        helloMsg: function () {
            return 'Hello, ' + this.name + '. You have ' + this.shipmentData.length + ' shipments.';
        }
    },
    watch: {
        shipmentData: function(val) {
            console.log('watching: ', val);
            this.getBookingStatus();
        }
    },
    created: function () {
        var self = this;
        $.get( "API/shipments.json").done(function( shipments ) {
            self.shipmentData.push(shipments.request);
            self.shipmentData = extendObject(self.shipmentData[0], { isOpen: false, bookingStatus: 'rejected' });
        });
    },
    mounted: function () {
        this.loading = true;
        var self = this;

        setTimeout(function () {
            self.getBookingStatus();
            self.loading = false;
        }, 2000);

        // Receive JSON data via EventBus
        // The object needs extending in order for the 
        // booking status and isOpen click event
        // to both function.
        EventBus.$on('update-accordion-data', function (payload) {
            this.jsonFromTextArea = JSON.parse(payload);
            var newData = this.jsonFromTextArea;
            $.extend({}, newData, { isOpen: false });
            this.shipmentData.push(newData);
        }.bind(this))
    }
});




/* Plan for JSON inputter
 * ----------------------
 * 1. PUT data  :: (ie) edit existing data within JSON array
 * To edit the existing data a .find() method will need to loop through the 
 * confirmation array and look at each items InternalReference.
 * If it matches, then update that object.
 * 
 * 2. POST data :: (ie) add new data to JSON array
 * Select either booking or schedule data array to post new data.
 * 
 */


/* ---- JSON INPUTTER ---- */
Vue.component('vue-json-inputter-component', {
    template: '#vue-json-inputter-component',
    data: function () {
        return {
            jsonData: ''
        }
    },
    methods: {
        sendJsonData () {
            this.$bus.$emit('update-accordion-data', this.jsonData);
        }
    }
});


/* -------------------- *\
    Vue Event Bus
\* -------------------- */

var EventBus = new Vue();

Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function () { return EventBus }
    }
});


/* -------------------- *\
    Vue Instance
\* -------------------- */

new Vue({
    el: '#vue-app'
});

