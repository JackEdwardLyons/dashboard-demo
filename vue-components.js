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
            requestData: []
        }
    },
    methods: {
        collapseIn (index) {
            return this.requestData[index].isOpen = true;
            //console.log(this.requestData[index]);
        }
    },
    computed: {
        helloMsg () {
            // helo message needs to be dynamic once the request data has been loaded.
            return 'Hello, ' + this.name + '. You have ' + this.requestData.length + ' shipments.';
        }
    },
    created: function () {
        var self = this;
        $.when(
            $.get( "API/mock-booking-data.json"),
            $.get( "API/mock-request-data.json")
        ).then(function( booking, request ) {
            self.bookingData.push(booking[0].data);
            self.requestData.push(request[0].data);

            self.bookingData = extendObject(self.bookingData[0], 'isOpen');
            self.requestData = extendObject(self.requestData[0], 'isOpen');
        });
    },
    mounted: function () {
        this.loading = true;
        var self = this;
        setTimeout(function () {
            self.loading = false;
        }, 2000);
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
        }
    }
});


/* -------------------- *\
    Vue Instance
\* -------------------- */
new Vue({
    el: '#vue-app'
});

