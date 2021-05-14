export function heartbeat(req, res) {
  res.send({
    message: 'Are you still alive?',
  });
}
