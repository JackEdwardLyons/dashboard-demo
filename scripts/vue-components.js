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
            shipments: null,
            loading: false,
            shipmentData: [],
            jsonFromTextArea: ''
        }
    },
    methods: {
        collapseIn: function (index) {
            return this.shipmentData[index].isOpen = true;
        },
        getBookingStatus() {
            return $.map(this.shipmentData, function (value, index) {
                console.log(value.rejected)
                if ( value.rejected.message ) {
                    value.bookingStatus = 'REJECTED';
                } else if ( $.isEmptyObject(value.rejected) && value.confirmation.CarrierReferenceNumber ) {
                    value.bookingStatus = 'CONFIRMED';
                } else if ( $.isEmptyObject(value.rejected) && value.confirmation.CarrierReferenceNumber === '' ) {
                    value.bookingStatus = 'PENDING' ;
                }  
                return value.bookingStatus;
            });
        }
    },
    computed: {
        helloMsg: function () {
            return 'Hello, ' + this.name + '. You have ' + this.shipmentData.length + ' shipments.';
        },
        bookingStatus: function (a) {
            // GRAB DATA FROM SHIPMENTS.JSON
            // default to REJECTED
            // test to see if CONFIRMATION is empty
            // if not empty -- status is CONFIRMED
            // META DATA available to show on front end
            // if confirmation is empty your in PENDING ... 
            // If deleted then CANCELLED
            // shipments[1]["confirmation"].hasOwnProperty( "ContainerReleaseNumber" )
            // shipments[1].keys("confirmation").length == 0;
            // return a.confirmation.CarrierReferenceNumber !== ''
            //     ? a.bookingStatus = 'confirmed'
            //     : a.bookingStatus = 'rejected';
        }
    },
    watch: {
        // shipmentData: function(val) {
        //     console.log('watching: ', val);
        //     this.getBookingStatus();
        // }
    },
    created: function () {
        var self = this;
        $.get( "API/shipments.json").done(function( shipments ) {
            console.log(shipments);
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
            this.jsonFromTextArea = payload;
            var newData = JSON.parse(this.jsonFromTextArea);
            $.extend({}, newData, { isOpen: false });
            console.log('new data: ', newData);
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
            jsonOption: '',
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

