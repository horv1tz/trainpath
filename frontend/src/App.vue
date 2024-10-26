<template>
  <div id="app">
    <!-- Header -->
    <header class="header">
      <div class="top-bar">
        <div class="logo">Лого</div>
        <div class="user-actions">
          <span class="user-action-item">
            <img src="@/assets/icons/profile.png" alt="Профиль">
            Профиль
          </span>
          <span class="user-action-item">
            <img src="@/assets/icons/support.png" alt="Поддержка">
            Поддержка
          </span>
          <span class="user-action-item">
            <img src="@/assets/icons/rub.png" alt="RUB">
            RUB
          </span>
        </div>
      </div>

      <!-- Selection Panel -->
      <nav class="selection-panel">
        <div class="input-group">
          <label>Откуда</label>
          <input type="text" placeholder="Ростов-на-Дону">
        </div>
        <div class="input-group">
          <label>Куда</label>
          <input type="text" placeholder="Москва">
        </div>
        <div class="input-group">
          <label>Дата</label>
          <input type="date" value="2024-10-26">
        </div>
        <button class="return-button">Обратно</button>

        <!-- Количество пассажиров -->
        <div class="input-group small-input">
          <label>Пассажиров</label>
          <select>
            <option>1 пассажир</option>
            <option>2 пассажира</option>
            <option>3 пассажира</option>
            <option>4 пассажира</option>
          </select>
        </div>

        <!-- Класс -->
        <div class="input-group small-input">
          <label>Класс</label>
          <select>
            <option>Эконом</option>
            <option>Комфорт</option>
            <option>Люкс</option>
          </select>
        </div>
        <button class="search-button">Найти билеты</button>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="content">
      <form class="form" action="/submit" method="post">
        <nav class="breadcrumb">
          <a href="#">Поиск билетов</a>
          <a href="#">Поезд туда</a>
          <a href="#" class="active">Данные пассажиров и оплата</a>
        </nav>

        <!-- Passenger Information -->
        <section class="form-section">
          <h2>Пассажир</h2>
          <div class="form-row">
            <div class="input-group">
              <label>Фамилия <span class="required">*</span></label>
              <input type="text" placeholder="Иванов" required>
            </div>
            <div class="input-group">
              <label>Имя <span class="required">*</span></label>
              <input type="text" placeholder="Иван" required>
            </div>
            <div class="input-group">
              <label>Отчество</label>
              <input type="text" placeholder="Иванович">
            </div>
          </div>
        </section>

        <!-- Ticket Information -->
        <section class="ticket-section">
          <h2>Билеты</h2>
          <div class="ticket-row">
            <div class="ticket-group">
              <label>Номер поезда <span class="required">*</span></label>
              <input type="text" placeholder="Введите номер поезда" required>
            </div>
            <div class="ticket-group">
              <label>Вагон <span class="required">*</span></label>
              <input type="text" placeholder="Введите номер вагона" required>
            </div>
            <div class="ticket-group">
              <label>Места <span class="required">*</span></label>
              <input type="text" placeholder="Введите номера мест">
            </div>
          </div>
        </section>

        <!-- Payment Section -->
        <section class="form-section">
          <h2>Оплата</h2>
          <div class="form-row">
            <div class="input-group">
              <label>Телефон <span class="required">*</span></label>
              <input type="tel" placeholder="+7 (900) 456 32-18" required>
            </div>
            <div class="input-group">
              <label>E-mail <span class="required">*</span></label>
              <input type="email" placeholder="example@mail.ru" required>
            </div>
          </div>
          <button type="submit" class="submit-button">Оплатить</button>
        </section>
      </form>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import "@/assets/select_bilet.css";
</style>
