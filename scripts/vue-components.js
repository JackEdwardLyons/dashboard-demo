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
            bookingData: [],
            scheduleData: [],
            jsonUpdateOption: '', 
            jsonFromTextArea: ''
        }
    },
    methods: {
        collapseIn: function (index) {
            return this.scheduleData[index].isOpen = true;
        }
    },
    computed: {
        helloMsg: function () {
            return 'Hello, ' + this.name + '. You have ' + this.scheduleData.length + ' shipments.';
        }
    },
    created: function () {
        var self = this;
        $.when(
            $.get( "API/mock-booking-data.json"),
            $.get( "API/mock-schedule-data.json")
        ).then(function( booking, schedule ) {
            self.bookingData.push(booking[0].data);
            self.scheduleData.push(schedule[0].data);
            self.scheduleData = extendObject(self.scheduleData[0], { isOpen: false, bookingStatus: 'pending' });
        });
    },
    mounted: function () {
        this.loading = true;
        var self = this;

        function getBookingStatus() {
            return $.map(self.scheduleData, function (value, index) {
                return value.BookingData.CarrierReferenceNumber !== ''
                    ? value.bookingStatus = 'confirmed'
                    : value.bookingStatus = 'rejected';
            });
        }

        setTimeout(function () {
            getBookingStatus();
            self.loading = false;
        }, 2000);

        // Receive JSON data via EventBus
        EventBus.$on('update-accordion-data', function (arg1, arg2) {
            this.jsonUpdateOption = arg1;
            this.jsonFromTextArea = arg2;
        }.bind(this))
    }
});




/* Plan for JSON inputter
 * ----------------------
 * 1. PUT data  :: (ie) edit existing data within JSON array
 * To edit the existing data a .find() method will need to loop through the 
 * bookingData array and look at each items InternalReference.
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
            this.$bus.$emit('update-accordion-data', this.jsonOption, this.jsonData);
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

