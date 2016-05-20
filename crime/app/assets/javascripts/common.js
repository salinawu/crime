$(function () {
    $('#timepickerstart').datetimepicker({
    	format: 'MM/DD/YYYY'
    });
    $('#timepickerend').datetimepicker({
    	format: 'MM/DD/YYYY',
        useCurrent: false //Important! See issue #1075
    });
    $("#timepickerstart").on("dp.change", function (e) {
        $('#timepickerend').data("DateTimePicker").minDate(e.date);
    });
    $("#timepickerend").on("dp.change", function (e) {
        $('#timepickerstart').data("DateTimePicker").maxDate(e.date);
    });
});