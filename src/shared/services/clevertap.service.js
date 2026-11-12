export const sendCleverTapEventEventOnly = (
  eventName,
  properties = {}
) => {
  if (
    !eventName ||
    typeof properties !== 'object' ||
    Object.keys(properties).length === 0
  ) {
    console.warn(
      'Parámetros inválidos para enviar el evento a CleverTap'
    );

    return;
  }

  const eventProps = {
    ...properties
  };

  if (
    eventProps.Phone &&
    typeof eventProps.Phone === 'string' &&
    !eventProps.Phone.startsWith('+')
  ) {
    eventProps.Phone =
      `+57${eventProps.Phone}`;
  }

  if (eventProps.Phone) {
    clevertap.onUserLogin.push({
      Site: {
        Identity: eventProps.Phone,
        Phone: eventProps.Phone
      }
    });
  }

  clevertap.event.push(
    eventName,
    eventProps
  );
};