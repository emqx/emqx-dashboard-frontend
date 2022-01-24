import _ from 'lodash'

const DEFAULT_PAGE_SIZE = 20

export default () => {
  let totalData = []
  // Use the following six variables to do a cache-like operation to reduce computational overhead
  let latestFiltersString = ''
  let listAfterFilter = []
  let latestSortFromString = undefined
  let listAfterFilterNSort = []
  let currentPageSize = DEFAULT_PAGE_SIZE
  let currentChunks = []

  const setTotalData = (data) => {
    totalData = data
    filterList()
    sortList()
    chunkList()
  }

  const filterList = (filters = []) => {
    latestFiltersString = JSON.stringify(filters)
    if (filters.length === 0) {
      listAfterFilter = totalData
    } else {
      listAfterFilter = totalData.filter((item) =>
        filters.every(({ key, value }) => {
          const target = item[key]
          return !target ? false : target.indexOf && item[key].indexOf(value) > -1
        }),
      )
    }
  }

  const sortList = (sortFrom) => {
    if (!sortFrom) {
      latestSortFromString = undefined
      listAfterFilterNSort = listAfterFilter
    } else {
      latestSortFromString = JSON.stringify(sortFrom)
      listAfterFilterNSort = _.orderBy(listAfterFilter, [sortFrom.key], [sortFrom.type])
    }
  }

  const chunkList = (pageSize = DEFAULT_PAGE_SIZE) => {
    currentPageSize = pageSize
    currentChunks = _.chunk(listAfterFilterNSort, currentPageSize)
  }

  const getAPageData = (pageMeta, filters = [], sortFrom) => {
    if (latestFiltersString !== JSON.stringify(filters)) {
      filterList(filters)
      sortList(sortFrom)
      chunkList(pageMeta.limit)
    } else if ((!sortFrom && latestSortFromString) || (sortFrom && latestSortFromString !== JSON.stringify(sortFrom))) {
      sortList(sortFrom)
      chunkList(pageMeta.limit)
    } else if (pageMeta.limit !== currentPageSize) {
      chunkList(pageMeta.limit)
    }
    const retData = currentChunks.length === 0 ? [] : currentChunks[pageMeta.page - 1] || []
    return {
      data: retData,
      meta: {
        count: listAfterFilterNSort.length,
        limit: pageMeta.limit,
        page: pageMeta.page,
      },
    }
  }

  return {
    totalData,
    listAfterFilter,
    setTotalData,
    getAPageData,
  }
}
