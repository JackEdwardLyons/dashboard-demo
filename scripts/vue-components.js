    /* ----------------------------------------------------------------- *\
    * Vue JS
    * Lifecycle hooks: https://alligator.io/vuejs/component-lifecycle/
    * ----------------------------------------------------------------- */


    /* ---- DATE RANGE PICKER COMPONENT ---- *\
    * The reason the datepicker is contained in it's own
    * component is that we don't want any jQuery to
    * clash with Vue. By encapsulating this code
    * within a Vue component there is no chance
    * of data leakage because Vue knows the 
    * exact state of the DOM.
    **/
    Vue.component('date-picker', {
        template: '<input id="_validity_range" placeholder="max. up to 6 weeks out" name="validity_range" value="" data-validate="start_date" class="form-control validatable hidden" form="void" type="text">',
        mounted: function () {
            var self = this;
            $(this.$el).daterangepicker();
                $('#_validity_range').on('apply.daterangepicker', function (ev, picker) {
                    var start = picker.startDate.format('DD-MM-YY');
                    var end   = picker.endDate.format('DD-MM-YY');
                    $('#date-view-badge').show().html(start + ' <br> to <br> ' + end);
                    self.$bus.$emit('update-date', start, end);
                }
            );
        },
        beforeDestroy: function() {
            $(this.$el).daterangepicker('hide').daterangepicker('destroy');
        }
    });
    


    /* ---- SHIPMENT BOOKING COMPONENT ---- */
    Vue.component('vue-shipment-booking-component', {
        template: '#vue-shipment-booking-component',
        data: function () {
            return {
                bookingRequest: {},
                startDate: '',
                endDate: '',
                qty_20G0: 0,
                qty_40G0: 0,
                qty_45G0: 0,
                selectedOriginPort: '',
                selectedDestinationPort: '',
                originPorts: [
                    { name: 'Brisbane, Australia', code: 'AUBNE' },
                    { name: 'Shanghai, China', code: 'CNSHA' },
                    { name: 'Colorado Springs', code: 'USCOS' },
                    { name: 'Hamburg, Germany', code: 'DEHAM' },
                    { name: 'Constantza, Romania', code: 'ROCND' }
                ],
                destinationPorts: [
                    { name: 'Brisbane, Australia', code: 'AUBNE' },
                    { name: 'Shanghai, China', code: 'CNSHA' },
                    { name: 'Colorado Springs', code: 'USCOS' },
                    { name: 'Hamburg, Germany', code: 'DEHAM' },
                    { name: 'Constantza, Romania', code: 'ROCND' }
                ]
            }
        },
        methods: {
            updateContainerQty: function (container, qty) {
                this[container] = qty;
            },
            updatePortName: function (ports, index, selectedPort) {
                this[selectedPort] = ports[index].code;
            },
            postBookingData() {
                var self = this;
                this.bookingRequest = {
                    "port_of_loading": this.selectedOriginPort,
                    "port_of_discharge": this.selectedDestinationPort,
                    "start_date": this.startDate,
                    "end_date": this.endDate,
                    "20G0": this.qty_20G0,
                    "42G0": this.qty_40G0,
                    "45G0": this.qty_45G0
                }
                swal({
                    title: "Your Booking Data in JSON",
                    icon: "warning",
                    text: `
                    {
                        "port_of_loading": "${ self.selectedOriginPort }",
                        "port_of_discharge": "${ self.selectedDestinationPort }",
                        "start_date": "${ self.startDate }",
                        "end_date": "${ self.endDate }",
                        "20G0": "${ self.qty_20G0 }",
                        "42G0": "${ self.qty_40G0 }",
                        "45G0": "${ self.qty_45G0 }"
                    }`
                })
            }
        },
        mounted: function () {
            var self = this;
            // Retreive the data from the daterangepicker
            EventBus.$on('update-date', function (start, end) {
                self.startDate = start;
                self.endDate = end;
            });
        }
    });



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
                .then( function (willDelete) {
                    if (willDelete) {
                        swal("Your booking has been cancelled.", {
                            icon: "success",
                        });
                        self.shipmentData[id].bookingStatus = 'CANCELLED';
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

            EventBus.$on('update-accordion-data', function (payload) {
                let newData = JSON.parse(payload);
                newData.isOpen = false;           
                self.shipmentData.push(newData);
            });
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

   /* ---- Vue Event Bus ---- *\
    * The event bus acts as a global data store,
    * allowing data to be emitted from one component
    * to another. This is because Vue follows a
    * one-directional data flow pattern.
    * 
    * Data can be passed down from parent components
    * but must be emitted back up from children and
    * to other components.
    **/
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

