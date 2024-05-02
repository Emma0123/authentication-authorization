'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert("accounts", [
    {
    username: "Khansa",
    email: "khansa467@gmail.com",
    password: "12345",
    createdAt: new Date(),
    updatedAt: new Date(),
   },
    {
    username: "Edo",
    email: "Edo@gmail.com",
    password: "23456",
    createdAt: new Date(),
    updatedAt: new Date(),
   },
    {
    username: "Tensei",
    email: "tensei@gmail.com",
    password: "34567",
    createdAt: new Date(),
    updatedAt: new Date(),
   },
  ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
