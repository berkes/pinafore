import {DEFAULT_TIMEOUT, get, paramsString} from '../../_utils/ajax'
import {auth, basename} from '../utils'

export function getTimelineUrlPath (timeline) {
  switch (timeline) {
    case 'local':
    case 'federated':
      return 'timelines/public'
    case 'home':
      return 'timelines/home'
    case 'notifications':
    case 'notifications/mentions':
      return 'notifications'
    case 'favorites':
      return 'favourites'
    case 'direct':
      return 'conversations'
  }
  if (timeline.startsWith('tag/')) {
    return 'timelines/tag'
  } else if (timeline.startsWith('account/')) {
    return 'accounts'
  } else if (timeline.startsWith('list/')) {
    return 'timelines/list'
  }
}

async function getTimelineUrl(instanceName, timeline, maxId, since, limit) {
  const timelineUrlName = getTimelineUrlPath(timeline)
  let url = `${basename(instanceName)}/api/v1/${timelineUrlName}`

  if (timeline.startsWith('tag/')) {
    url += '/' + timeline.split('/')[1]
  } else if (timeline.startsWith('account/')) {
    url += '/' + timeline.split('/')[1] + '/statuses'
  } else if (timeline.startsWith('list/')) {
    url += '/' + timeline.split('/')[1]
  }

  const params = {}
  if (since) {
    params.since_id = since
  }

  if (maxId) {
    params.max_id = maxId
  }

  if (limit) {
    params.limit = limit
  }

  if (timeline === 'local') {
    params.local = true
  }

  if (timeline.startsWith('account/')) {
    if (timeline.endsWith('media')) {
      params.only_media = true
    } else {
      params.exclude_replies = !timeline.endsWith('/with_replies')
    }
  }

  if (timeline === 'notifications/mentions') {
    params.exclude_types = ['follow', 'favourite', 'reblog', 'poll']
  }

  url += '?' + paramsString(params)
  return url
}

export async function fetchTimeline(instanceName, accessToken, timeline, maxId, since, limit) {
  const url = getTimelineUrl(instanceName, timeline, maxId, since, limit)
  return get(url, auth(accessToken), { timeout: DEFAULT_TIMEOUT })
}