<template>
  <article id="calendar">
    <header>
      <div class="current-date">
        <div class="current-day">Saturday</div>
        <div class="today">
          <div><div class="arrow-up"></div></div>
          <div><div class="arrow-up"></div></div>
          <div><div class="arrow-up"></div></div>
          <div>15</div>
          <div>January</div>
          <div>2025</div>
          <div><div class="arrow-down"></div></div>
          <div><div class="arrow-down"></div></div>
          <div><div class="arrow-down"></div></div>
        </div>
      </div>
    </header>
    <section>
      <div class="weekdays">
        <div
          class="weekday"
          v-for="(weekday, idx) in weekdays"
          :key="idx"
        >
          {{ weekday }}
        </div>
      </div>
      <div class="date">
        <div class="day-hidden">29</div>
        <div class="day-hidden">30</div>
        <div class="day-hidden">31</div>
        <div
          class="day"
          v-for="(n, idx) in 31"
          :key="idx"
        >
          {{ n }}
        </div>
        <div
          class="day-hidden"
          v-for="(n, idx) in 8"
          :key="idx"
        >
          {{ n }}
        </div>
      </div>
    </section>
  </article>
</template>
<script>
export default {
  name: "Calendar",
  data() {
    return {
      weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      weekdayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      month: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      currentDate: {
        date: 0,
        month: 0,
        year: 0,
      },
    };
  },
};
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Anton");

@mixin calendar-layout($property) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  grid-gap: 10px;
  padding: $property;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    color: var(--white);
    border-radius: 5px;
  }
}

@mixin arrow-style() {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  cursor: pointer;
}

#calendar {
  width: 460px;
  height: 730px;
  background-color: var(--light-gray);
  font-family: "Anton";
  border-radius: 15px;
  overflow: hidden;
  background: url("../assets/calendar/7.jpg") center center;
  background-size: cover;

  header {
    display: flex;
    justify-content: center;
    align-items: top;
    height: 400px;
    padding: 20px 0 0;
    text-align: center;
    overflow: hidden;
    color: var(--light-gray);
    text-shadow: 1px 1px 1px var(--dark-gray), 1px -1px 1px var(--dark-gray), -1px 1px 1px var(--dark-gray),
      -1px -1px 1px var(--dark-gray);

    .current-date {
      width: 300px;

      .arrow-up {
        @include arrow-style();
        border-bottom: 10px solid var(--white);

        &:hover {
          border-bottom: 10px solid var(--md-tran-black);
        }
      }
      .arrow-down {
        @include arrow-style();
        border-top: 10px solid var(--white);

        &:hover {
          border-top: 10px solid var(--md-tran-black);
        }
      }
    }
    .today {
      display: grid;
      grid-template-columns: 40px auto 70px;
      grid-gap: 0;

      div {
        display: flex;
        justify-content: center;
      }
    }
    .current-day {
      font-size: 4rem;
    }
    .today {
      font-size: 2rem;
    }
  }

  .weekdays {
    @include calendar-layout(10px 20px 10px);
    background-color: var(--md-tran-black);
    border-bottom: 1px solid var(--white);

    div:first-child,
    div:nth-child(7n) {
      color: var(--red);
    }
  }

  .date {
    @include calendar-layout(10px 20px 20px);
    background-color: var(--lt-tran-black);

    .day {
      cursor: pointer;

      &:hover {
        background-color: var(--white);
        color: var(--slate-green);
      }

      &:first-child,
      &:nth-child(7n) {
        color: var(--red);

        &:hover {
          background-color: var(--white);
          color: var(--red);
        }
      }
    }

    .day-hidden {
      opacity: 0.4;

      &:first-child,
      &:nth-child(7) {
        color: var(--red);
      }
    }
  }
}
</style>
