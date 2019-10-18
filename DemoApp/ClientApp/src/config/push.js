(function(window) {
    'use strict';

    var fadPushElemenmt = document.querySelector('.fab__push');
    var fabPushImgElement = document.querySelector('.fab__image');

    function isPushSupported() {
        if(Notification.permission === 'denied') {
            console.warn('User has blocked push notification.');
            return;
        }

        if(!('PushManager' in window)) {
            console.error('Push notification isn\'t supported in your browser.');
            return;
        }

        navigator.serviceWorker.ready
            .then(function (registration) {
                registration.pushManager.getSubscription()
                .then(function (subscription) {
                    if(subscription) {
                        changePushStatus(true);
                    } else {
                        changePushStatus(false);
                    }
                }).catch(function (error) {
                    console.error('Error occurred while enabling push ', error);
                });
            });
    }

    //To subscribe 'push notification'
    function subscribePush() {
        navigator.serviceWorker.ready.then(function(registration) {
            if(!registration.pushManager) {
                alert('Your browser doesn\'t support push notification.');
                return false;
            }

            registration.pushManager.subscribe({
                userVisibleOnly: true
            }).then(function(subscription) {
                toast('Subscribed successfully.')
                console.info('Push notification subscribed.');
                sendPushStatus(true);
                sendPushNotification();
            }).catch(function (error) {
                changePushStatus(false);
                console.error('Push notification subscription error: ', error);
            })
        })
    }

    function unsubscribePush() {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.pushManager.getSubscription()
            .then(function(subscription) {
                if(!subscription) {
                    console.error('Unable to unregister push notification.');
                    return;
                }

                //Unsubscribe `push notification`
                subscription.unsubscribe()
                    .then(function() {
                        toast('Unsubscribed successfully.');
                        console.info('Push notification unsubscribed.')
                        changePushStatus(false);
                    })
                    .catch(function(error) {
                        console.error(error);
                    })
            })
            .catch(function (error) {
              console.error('Failed to unsubscribe push notification.');
            });
        })
    }

    function changePushStatus(status) {
        fabPushElement.dataset.checked = status;
        fadPushElemenmt.checked = status;

        if(status) {
            fabPushElement.classList.add('activie');
            fabPushImgElement.src = '../images/icons/alarm.png';
        } else {
            fabPushElement.classList.remove('active');
            fabPushImgElement.src = '../images/icons/silence.png';
        }
    }

    fabPushElement.addEventListener('click', function() {
        var isSubscribed = (fabPushElement.dataset.checked === 'true');
        if(isSubscribed) {
            unsubscribePush();
        } else {
            subscribePush();
        }
    });

    function sendPushNotification() {
        navigator.serviceWorker.ready
            .then(function(registration) {
                registration.pushManager.getSubscription().then(function(subscription) {
                    //Send `push notification` - source for below url `server.js`
                    fetch('https://progressive-web-application.herokuapp.com/send_notification', {
                        method: 'post',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(subscription)
                    })
                    .then(function(response) {
                        return response.json();
                    })
                })
            })
    }

    isPushSupported();
})(window);