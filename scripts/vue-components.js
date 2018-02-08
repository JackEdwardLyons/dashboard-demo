/* ----------------------------------------------------------------- *\
 * Vue JS
 * Lifecycle hooks: https://alligator.io/vuejs/component-lifecycle/
 * ----------------------------------------------------------------- */






/* ---- SHIPMENT BOOKING COMPONENT ---- */
Vue.component('vue-shipment-booking-component', {
    template: '#vue-shipment-booking-component',
    data: function () {
        return {

        }
    }
});



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
              .then(function (willDelete) {
                if (willDelete) {
                    swal("Your booking has been cancelled.", {
                        icon: "success",
                    });
                    this.shipmentData[id].bookingStatus = 'CANCELLED';
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
  
    created() {
        let vm = this;
        $.get( "API/shipments.json").done(function( shipments ) {
            vm.shipmentData = shipments.request.map(item => {
                item.isOpen = false;
                item.bookingStatus = 'rejected';
                
                return item;
            });
        });
    },
  
    watch: {
      shipmentData: function() {
          this.getBookingStatus();
      }
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
            let newData = JSON.parse(payload);
            newData.isOpen = false;           
            self.shipmentData.push(newData);
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

