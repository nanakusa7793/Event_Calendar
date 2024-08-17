$(document).ready(function() {
    moment.locale('ja');
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ja',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            $.ajax({
                url: '/api/events/',
                method: 'GET',
                timeout: 600000,
                success: function(data) {
                    var events = data.map(function(event) {
                        return {
                            id: event.id,
                            title: event.title,
                            start: event.start_date + (event.start_time ? 'T' + event.start_time : ''),
                            end: event.end_date + (event.end_time ? 'T' + event.end_time : ''),
                            extendedProps: {
                                content: event.content
                            }
                        };
                    });
                    successCallback(events);
                },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText);
                    failureCallback(error);
                }
            });
        },
        dateClick: function(info) {
            $('#start_date').val(info.dateStr);
            $('#end_date').val(info.dateStr);
            $('#eventModal').show();
        },
        eventClick: function(info) {
            $('#eventTitle').text(info.event.title);
            $('#eventDates').text(moment(info.event.start).format('YYYY-MM-DD HH:mm') + ' - ' + moment(info.event.end).format('YYYY-MM-DD HH:mm'));
            $('#eventContent').text(info.event.extendedProps.content);
            $('#deleteEvent').data('id', info.event.id);
            $('#eventDetails').show();
        }
    });
    calendar.render();

    // モーダル操作
    var modal = document.getElementById("eventModal");
    var btn = document.getElementById("addEventButton");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // イベント追加
    $('#eventForm').on('submit', function(e) {
        e.preventDefault();
        var title = $('#title').val();
        var start_date = $('#start_date').val();
        var start_time = $('#start_time').val();
        var end_date = $('#end_date').val();
        var end_time = $('#end_time').val();
        var content = $('#content').val();

        $.ajax({
            url: '/api/events/',
            method: 'POST',
            data: JSON.stringify({
                title: title,
                start_date: start_date,
                start_time: start_time || null,
                end_date: end_date,
                end_time: end_time || null,
                content: content
            }),
            contentType: 'application/json',
            timeout: 600000,
            success: function() {
                calendar.refetchEvents();
                alert('イベントが追加されました');
                $('#title').val('');
                $('#start_date').val('');
                $('#start_time').val('');
                $('#end_date').val('');
                $('#end_time').val('');
                $('#content').val('');
                modal.style.display = "none";
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    });

    // イベント削除
    $('#deleteEvent').on('click', function() {
        var eventId = $(this).data('id');
        $.ajax({
            url: '/api/events/' + eventId + '/',
            method: 'DELETE',
            timeout: 600000,
            success: function() {
                calendar.refetchEvents();
                alert('イベントが削除されました');
                $('#eventDetails').hide();
            },
            error: function(xhr, status, error) {
                alert('エラーが発生しました: ' + xhr.responseText);
            }
        });
    });

    // イベント詳細閉じる
    $('#eventDetails .close').on('click', function() {
        $('#eventDetails').hide();
    });
});
