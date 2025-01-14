import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserMigration1736752876493 implements MigrationInterface {
    name = 'AlterUserMigration1736752876493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "e_Enrollment" DROP CONSTRAINT "FK_1ed997db311fafefd0313efd8f9"`);
        await queryRunner.query(`ALTER TABLE "e_submissions" DROP CONSTRAINT "FK_95536b0f5c0d1bdd1b520907d4b"`);
        await queryRunner.query(`ALTER TABLE "e_instructor" DROP CONSTRAINT "FK_e7517cc5d8d643d36aacf3a8c2b"`);
        await queryRunner.query(`CREATE TABLE "e_students" ("id" uuid NOT NULL, "userId" uuid, CONSTRAINT "PK_ec7199de5ed9bfa94c1c3b92041" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."e_users_role_enum" AS ENUM('Student', 'Instructor', 'Admin')`);
        await queryRunner.query(`CREATE TABLE "e_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying, "address" character varying, "phone" character varying, "otp" character varying, "verified" boolean, "role" "public"."e_users_role_enum" NOT NULL, "profileUrl" character varying, "accountCreateAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "twoFactorSecret" character varying, "twoFactorEnabled" boolean NOT NULL DEFAULT false, "twoFactVerified" boolean DEFAULT false, "otpAscii" character varying, "otpHex" character varying, "otpBase32" character varying, "otpAuthUrl" character varying, "passwordResetOTP" character varying, "resetOTPExpiresAt" TIMESTAMP, "otpExpiresAt" TIMESTAMP, CONSTRAINT "PK_9f00aee408a4747f577a41cf505" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d61f8cef87a402e1f382f561d2" ON "e_users" ("email") `);
        await queryRunner.query(`ALTER TABLE "e_students" ADD CONSTRAINT "FK_7c8ab38521c64f5bb01e551949d" FOREIGN KEY ("userId") REFERENCES "e_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "e_Enrollment" ADD CONSTRAINT "FK_1ed997db311fafefd0313efd8f9" FOREIGN KEY ("studentId") REFERENCES "e_students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_submissions" ADD CONSTRAINT "FK_95536b0f5c0d1bdd1b520907d4b" FOREIGN KEY ("studentId") REFERENCES "e_students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_instructor" ADD CONSTRAINT "FK_e7517cc5d8d643d36aacf3a8c2b" FOREIGN KEY ("userId") REFERENCES "e_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "e_instructor" DROP CONSTRAINT "FK_e7517cc5d8d643d36aacf3a8c2b"`);
        await queryRunner.query(`ALTER TABLE "e_submissions" DROP CONSTRAINT "FK_95536b0f5c0d1bdd1b520907d4b"`);
        await queryRunner.query(`ALTER TABLE "e_Enrollment" DROP CONSTRAINT "FK_1ed997db311fafefd0313efd8f9"`);
        await queryRunner.query(`ALTER TABLE "e_students" DROP CONSTRAINT "FK_7c8ab38521c64f5bb01e551949d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d61f8cef87a402e1f382f561d2"`);
        await queryRunner.query(`DROP TABLE "e_users"`);
        await queryRunner.query(`DROP TYPE "public"."e_users_role_enum"`);
        await queryRunner.query(`DROP TABLE "e_students"`);
        await queryRunner.query(`ALTER TABLE "e_instructor" ADD CONSTRAINT "FK_e7517cc5d8d643d36aacf3a8c2b" FOREIGN KEY ("userId") REFERENCES "e_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_submissions" ADD CONSTRAINT "FK_95536b0f5c0d1bdd1b520907d4b" FOREIGN KEY ("studentId") REFERENCES "e_student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_Enrollment" ADD CONSTRAINT "FK_1ed997db311fafefd0313efd8f9" FOREIGN KEY ("studentId") REFERENCES "e_student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
