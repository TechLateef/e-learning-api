import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatUserMigration1735800585378 implements MigrationInterface {
    name = 'CreatUserMigration1735800585378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP CONSTRAINT "FK_ac0adfb05c58676eeea6696c948"`);
        await queryRunner.query(`CREATE TABLE "access_student" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, CONSTRAINT "PK_23975eac29c52b9307b2e55cac4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "access_instructor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, CONSTRAINT "PK_19a6228788d955baa2d2caf0fac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "access_accessment" ("id" SERIAL NOT NULL, "accessment_type" character varying NOT NULL, "description" character varying NOT NULL, "grade" integer NOT NULL, "feedback" character varying NOT NULL, "courseId" integer, "studentId" uuid, "instructorId" uuid, CONSTRAINT "PK_7e7d4c74689adff436c4eb1013d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."access_user_role_enum" AS ENUM('Student', 'Instructor', 'Admin')`);
        await queryRunner.query(`CREATE TABLE "access_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying, "address" character varying, "phone" character varying, "otp" character varying, "verified" boolean, "role" "public"."access_user_role_enum" NOT NULL, "accountCreateAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "twoFactorSecret" character varying, "twoFactorEnabled" boolean NOT NULL DEFAULT false, "twoFactVerified" boolean DEFAULT false, "otpAscii" character varying, "otpHex" character varying, "otpBase32" character varying, "otpAuthUrl" character varying, "passwordResetOTP" character varying, "resetOTPExpiresAt" TIMESTAMP, "otpExpiresAt" TIMESTAMP, CONSTRAINT "PK_2d29a8162ec942b00d044d8e170" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "access_instructor_courses_course" ("accessInstructorId" uuid NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_cce161a09a7768ab74da0d5f9e6" PRIMARY KEY ("accessInstructorId", "courseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_208cb2039fed60ff58c3eb20c6" ON "access_instructor_courses_course" ("accessInstructorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aee65f4cf0f01aef23e4dce720" ON "access_instructor_courses_course" ("courseId") `);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP COLUMN "CreateAt"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP COLUMN "updateAt"`);
        await queryRunner.query(`CREATE TYPE "public"."Enrollment_status_enum" AS ENUM('active', 'canceled', 'completed')`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD "status" "public"."Enrollment_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP CONSTRAINT "PK_ac7f1af7e63bbfc10e7dd9d588a"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD CONSTRAINT "PK_ac7f1af7e63bbfc10e7dd9d588a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP COLUMN "studentId"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD "studentId" uuid`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0212f9387e0c78a4d3e6091a7e" ON "Enrollment" ("studentId", "courseId") `);
        await queryRunner.query(`ALTER TABLE "access_student" ADD CONSTRAINT "FK_6b0b3cde73c3cd1d1a07a83e031" FOREIGN KEY ("userId") REFERENCES "access_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD CONSTRAINT "FK_ac0adfb05c58676eeea6696c948" FOREIGN KEY ("studentId") REFERENCES "access_student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "access_instructor" ADD CONSTRAINT "FK_f0be947c9f6e3eb203bfec61017" FOREIGN KEY ("userId") REFERENCES "access_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "access_accessment" ADD CONSTRAINT "FK_5f8634bac776e0331948595c5ce" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "access_accessment" ADD CONSTRAINT "FK_4bb3f54aad97efc0f1c4572bce5" FOREIGN KEY ("studentId") REFERENCES "access_student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "access_accessment" ADD CONSTRAINT "FK_e956095a7b2371e85f68aa22141" FOREIGN KEY ("instructorId") REFERENCES "access_instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "access_instructor_courses_course" ADD CONSTRAINT "FK_208cb2039fed60ff58c3eb20c6e" FOREIGN KEY ("accessInstructorId") REFERENCES "access_instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "access_instructor_courses_course" ADD CONSTRAINT "FK_aee65f4cf0f01aef23e4dce720b" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "access_instructor_courses_course" DROP CONSTRAINT "FK_aee65f4cf0f01aef23e4dce720b"`);
        await queryRunner.query(`ALTER TABLE "access_instructor_courses_course" DROP CONSTRAINT "FK_208cb2039fed60ff58c3eb20c6e"`);
        await queryRunner.query(`ALTER TABLE "access_accessment" DROP CONSTRAINT "FK_e956095a7b2371e85f68aa22141"`);
        await queryRunner.query(`ALTER TABLE "access_accessment" DROP CONSTRAINT "FK_4bb3f54aad97efc0f1c4572bce5"`);
        await queryRunner.query(`ALTER TABLE "access_accessment" DROP CONSTRAINT "FK_5f8634bac776e0331948595c5ce"`);
        await queryRunner.query(`ALTER TABLE "access_instructor" DROP CONSTRAINT "FK_f0be947c9f6e3eb203bfec61017"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP CONSTRAINT "FK_ac0adfb05c58676eeea6696c948"`);
        await queryRunner.query(`ALTER TABLE "access_student" DROP CONSTRAINT "FK_6b0b3cde73c3cd1d1a07a83e031"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0212f9387e0c78a4d3e6091a7e"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP COLUMN "studentId"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD "studentId" integer`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP CONSTRAINT "PK_ac7f1af7e63bbfc10e7dd9d588a"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD CONSTRAINT "PK_ac7f1af7e63bbfc10e7dd9d588a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."Enrollment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD "CreateAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aee65f4cf0f01aef23e4dce720"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_208cb2039fed60ff58c3eb20c6"`);
        await queryRunner.query(`DROP TABLE "access_instructor_courses_course"`);
        await queryRunner.query(`DROP TABLE "access_user"`);
        await queryRunner.query(`DROP TYPE "public"."access_user_role_enum"`);
        await queryRunner.query(`DROP TABLE "access_accessment"`);
        await queryRunner.query(`DROP TABLE "access_instructor"`);
        await queryRunner.query(`DROP TABLE "access_student"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD CONSTRAINT "FK_ac0adfb05c58676eeea6696c948" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
