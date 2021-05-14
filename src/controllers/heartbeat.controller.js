export function heartbeat(req, res) {
  console.log('wut? req ==>', req.body);
  res.send({
    message: 'Are you still alive?',
  });
}
