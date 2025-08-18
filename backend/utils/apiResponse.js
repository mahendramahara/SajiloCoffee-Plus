export function success(res, data = null, message = 'Success', code = 200) {
  return res.status(code).json({ success: true, message, data });
}

export function error(res, message = 'Error', code = 500, errors = null) {
  return res.status(code).json({ success: false, message, errors });
}

export function validation(res, message = 'Validation error', errors = [], code = 400) {
  return res.status(code).json({ success: false, message, errors });
}

export function notFound(res, message = 'Not found') {
  return res.status(404).json({ success: false, message });
}

export function unauthorized(res, message = 'Unauthorized') {
  return res.status(401).json({ success: false, message });
}
