import request from "./index"

export function getHoliday(url) {
    return request.get(url)
}