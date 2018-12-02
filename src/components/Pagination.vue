<template>
  <ul class="pagination">
    <li>
      <a href="#" @click.prevent="pageChanged(1)" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li v-for="n in paginationRange" :class="activePage(n)" v-bind:key="n">
      <a href="#" @click.prevent="pageChanged(n)">{{ n }}</a>
    </li>
    <li>
      <a href="#" @click.prevent="pageChanged(lastPage)" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },

    totalPages: Number,

    itmesPerPage: Number,

    totalItems: Number,

    visiblePages: {
      type: Number,
      default: 5,
      coerce: (val) => parseInt(val)
    }
  },
  computed: {
    lastPage( ) {
      if (this.totalPages) {
        return this.totalPages
      } else {
        return this.totalItems % this.itmesPerPage === 0
          ? this.totalItems / this.itmesPerPage
            : Math.floor(this.totalItems / this.itmesPerPage) + 1
      }
    },

    paginationRange( ) {
      let start =
        this.currentPage - this.visiblePages / 2 <= 0
          ? 1 : this.currentPage + this.visiblePages / 2 > this.lastPage
          ? this.lowerBound(this.lastPage - this.visiblePages + 1, 1)
          : Math.ceil(this.currentPage - this.visiblePages / 2)

      let range = []

      for (let i = 0; i < this.visiblePages && i < this.lastPage; i++) {
        range.push(start + i)
      }

      return range
    }
  },
  methods: {
    activePage (pageNum) {
      return this.currentPage === pageNum ? 'active' : ''
    },
    pageChanged (pageNum) {
      this.$emit('page-changed', pageNum)
    },
    lowerBound (num, limit) {
      return num >= limit ? num : limit
    }
  }
}
</script>
