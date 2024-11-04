"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTablesMigration1730755440046 = void 0;
class CreateTablesMigration1730755440046 {
    constructor() {
        this.name = 'CreateTablesMigration1730755440046';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "course" ("id" SERIAL NOT NULL, "duration" integer NOT NULL, "is_available" boolean NOT NULL DEFAULT true, "description" character varying NOT NULL, "category" character varying NOT NULL, "CreateAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying, "address" character varying, "phone" character varying, "role" character varying NOT NULL, "resetTokenExpiresAt" integer, "accountCreateAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "twoFactorSecret" character varying, "twoFactorEnabled" boolean NOT NULL DEFAULT false, "passwordResetToken" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Enrollment" ("id" SERIAL NOT NULL, "CreateAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "courseId" integer, "studentId" integer, CONSTRAINT "PK_ac7f1af7e63bbfc10e7dd9d588a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_courses_course" ("userId" integer NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_c0795b2733bf088882aa84663cd" PRIMARY KEY ("userId", "courseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e99d8f99eff1a45a772b11060e" ON "user_courses_course" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d67262674f71493825eb35e2e2" ON "user_courses_course" ("courseId") `);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD CONSTRAINT "FK_cf544fd6b45992f41961a7b50ba" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD CONSTRAINT "FK_ac0adfb05c58676eeea6696c948" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_courses_course" ADD CONSTRAINT "FK_e99d8f99eff1a45a772b11060e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_courses_course" ADD CONSTRAINT "FK_d67262674f71493825eb35e2e2c" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_courses_course" DROP CONSTRAINT "FK_d67262674f71493825eb35e2e2c"`);
        await queryRunner.query(`ALTER TABLE "user_courses_course" DROP CONSTRAINT "FK_e99d8f99eff1a45a772b11060e5"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP CONSTRAINT "FK_ac0adfb05c58676eeea6696c948"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP CONSTRAINT "FK_cf544fd6b45992f41961a7b50ba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d67262674f71493825eb35e2e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e99d8f99eff1a45a772b11060e"`);
        await queryRunner.query(`DROP TABLE "user_courses_course"`);
        await queryRunner.query(`DROP TABLE "Enrollment"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "course"`);
    }
}
exports.CreateTablesMigration1730755440046 = CreateTablesMigration1730755440046;
