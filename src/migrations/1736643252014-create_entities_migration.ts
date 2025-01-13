import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEntitiesMigration1736643252014 implements MigrationInterface {
    name = 'CreateEntitiesMigration1736643252014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "e_module" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "order" integer NOT NULL, "contentUrl" text array, "videoUrl" text array, "is_active" boolean NOT NULL DEFAULT true, "completed" boolean NOT NULL DEFAULT false, "CreateAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "courseId" uuid, CONSTRAINT "PK_c875b0d95710878f3acab2f33eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "e_student" ("id" uuid NOT NULL, "userId" uuid, CONSTRAINT "PK_d5c2e3b89c466dd1e9011521582" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."e_Enrollment_status_enum" AS ENUM('active', 'canceled', 'completed')`);
        await queryRunner.query(`CREATE TABLE "e_Enrollment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."e_Enrollment_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "courseId" uuid, "studentId" uuid, CONSTRAINT "PK_be2bd803e0d3aba7918c15d940b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c88b780610091dfe79e07af90e" ON "e_Enrollment" ("studentId", "courseId") `);
        await queryRunner.query(`CREATE TABLE "e_submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "submissionContent" character varying, "fileUrl" character varying, "grade" double precision, "feedback" character varying, "submittedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accessmentId" uuid NOT NULL, "studentId" uuid NOT NULL, CONSTRAINT "PK_62b54fd20042ae7c7490c6b52dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."e_accessments_accessmenttype_enum" AS ENUM('Exams', 'Test', 'Assignment')`);
        await queryRunner.query(`CREATE TABLE "e_accessments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accessmentType" "public"."e_accessments_accessmenttype_enum" NOT NULL, "title" character varying NOT NULL, "description" character varying, "maxGrade" integer, "courseId" uuid NOT NULL, "instructorId" uuid NOT NULL, CONSTRAINT "PK_ff4c31a52c9dd39650ca0dd0bc0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "e_course" ("id" uuid NOT NULL, "title" character varying NOT NULL, "duration" integer NOT NULL, "isAvailable" boolean NOT NULL DEFAULT true, "description" character varying NOT NULL, "category" character varying NOT NULL, "completed" boolean NOT NULL DEFAULT false, "CreateAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf2d7a365a0619c268d151bb303" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "e_instructor" ("id" uuid NOT NULL, "userId" uuid, CONSTRAINT "PK_dc84feb7f47c32549af76ccbac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."e_user_role_enum" AS ENUM('Student', 'Instructor', 'Admin')`);
        await queryRunner.query(`CREATE TABLE "e_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying, "address" character varying, "phone" character varying, "otp" character varying, "verified" boolean, "role" "public"."e_user_role_enum" NOT NULL, "profileUrl" character varying, "accountCreateAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "twoFactorSecret" character varying, "twoFactorEnabled" boolean NOT NULL DEFAULT false, "twoFactVerified" boolean DEFAULT false, "otpAscii" character varying, "otpHex" character varying, "otpBase32" character varying, "otpAuthUrl" character varying, "passwordResetOTP" character varying, "resetOTPExpiresAt" TIMESTAMP, "otpExpiresAt" TIMESTAMP, CONSTRAINT "PK_aaabcb097a8ad13986dd372c5cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "e_instructor_courses_e_course" ("eInstructorId" uuid NOT NULL, "eCourseId" uuid NOT NULL, CONSTRAINT "PK_bc7bda908d9ae3c8ed47f3aea0a" PRIMARY KEY ("eInstructorId", "eCourseId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aa807012d03e118c75e3fb8c07" ON "e_instructor_courses_e_course" ("eInstructorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2654ab497617f5ecc4ad6ef1ec" ON "e_instructor_courses_e_course" ("eCourseId") `);
        await queryRunner.query(`ALTER TABLE "e_module" ADD CONSTRAINT "FK_5b9f9eb1ad19f4f18daa09e28ee" FOREIGN KEY ("courseId") REFERENCES "e_course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_student" ADD CONSTRAINT "FK_74f04d6ec085e581b280e60e5c5" FOREIGN KEY ("userId") REFERENCES "e_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_Enrollment" ADD CONSTRAINT "FK_045a80518baa3dbe5cbbac6def3" FOREIGN KEY ("courseId") REFERENCES "e_course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_Enrollment" ADD CONSTRAINT "FK_1ed997db311fafefd0313efd8f9" FOREIGN KEY ("studentId") REFERENCES "e_student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_submissions" ADD CONSTRAINT "FK_23e89f8c737ed6d94b8bb6b5abf" FOREIGN KEY ("accessmentId") REFERENCES "e_accessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_submissions" ADD CONSTRAINT "FK_95536b0f5c0d1bdd1b520907d4b" FOREIGN KEY ("studentId") REFERENCES "e_student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_accessments" ADD CONSTRAINT "FK_e457ec4099dbf45f43a370c9b47" FOREIGN KEY ("courseId") REFERENCES "e_course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_accessments" ADD CONSTRAINT "FK_fc0d1200d79e62413c797eaca3f" FOREIGN KEY ("instructorId") REFERENCES "e_instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_instructor" ADD CONSTRAINT "FK_e7517cc5d8d643d36aacf3a8c2b" FOREIGN KEY ("userId") REFERENCES "e_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_instructor_courses_e_course" ADD CONSTRAINT "FK_aa807012d03e118c75e3fb8c07c" FOREIGN KEY ("eInstructorId") REFERENCES "e_instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "e_instructor_courses_e_course" ADD CONSTRAINT "FK_2654ab497617f5ecc4ad6ef1ec0" FOREIGN KEY ("eCourseId") REFERENCES "e_course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "e_instructor_courses_e_course" DROP CONSTRAINT "FK_2654ab497617f5ecc4ad6ef1ec0"`);
        await queryRunner.query(`ALTER TABLE "e_instructor_courses_e_course" DROP CONSTRAINT "FK_aa807012d03e118c75e3fb8c07c"`);
        await queryRunner.query(`ALTER TABLE "e_instructor" DROP CONSTRAINT "FK_e7517cc5d8d643d36aacf3a8c2b"`);
        await queryRunner.query(`ALTER TABLE "e_accessments" DROP CONSTRAINT "FK_fc0d1200d79e62413c797eaca3f"`);
        await queryRunner.query(`ALTER TABLE "e_accessments" DROP CONSTRAINT "FK_e457ec4099dbf45f43a370c9b47"`);
        await queryRunner.query(`ALTER TABLE "e_submissions" DROP CONSTRAINT "FK_95536b0f5c0d1bdd1b520907d4b"`);
        await queryRunner.query(`ALTER TABLE "e_submissions" DROP CONSTRAINT "FK_23e89f8c737ed6d94b8bb6b5abf"`);
        await queryRunner.query(`ALTER TABLE "e_Enrollment" DROP CONSTRAINT "FK_1ed997db311fafefd0313efd8f9"`);
        await queryRunner.query(`ALTER TABLE "e_Enrollment" DROP CONSTRAINT "FK_045a80518baa3dbe5cbbac6def3"`);
        await queryRunner.query(`ALTER TABLE "e_student" DROP CONSTRAINT "FK_74f04d6ec085e581b280e60e5c5"`);
        await queryRunner.query(`ALTER TABLE "e_module" DROP CONSTRAINT "FK_5b9f9eb1ad19f4f18daa09e28ee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2654ab497617f5ecc4ad6ef1ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aa807012d03e118c75e3fb8c07"`);
        await queryRunner.query(`DROP TABLE "e_instructor_courses_e_course"`);
        await queryRunner.query(`DROP TABLE "e_user"`);
        await queryRunner.query(`DROP TYPE "public"."e_user_role_enum"`);
        await queryRunner.query(`DROP TABLE "e_instructor"`);
        await queryRunner.query(`DROP TABLE "e_course"`);
        await queryRunner.query(`DROP TABLE "e_accessments"`);
        await queryRunner.query(`DROP TYPE "public"."e_accessments_accessmenttype_enum"`);
        await queryRunner.query(`DROP TABLE "e_submissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c88b780610091dfe79e07af90e"`);
        await queryRunner.query(`DROP TABLE "e_Enrollment"`);
        await queryRunner.query(`DROP TYPE "public"."e_Enrollment_status_enum"`);
        await queryRunner.query(`DROP TABLE "e_student"`);
        await queryRunner.query(`DROP TABLE "e_module"`);
    }

}
