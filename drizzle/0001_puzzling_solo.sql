CREATE TABLE "sync_mutations" (
	"user_id" uuid NOT NULL,
	"mutation_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sync_mutations_user_id_mutation_id_pk" PRIMARY KEY("user_id","mutation_id")
);
--> statement-breakpoint
ALTER TABLE "sync_mutations" ADD CONSTRAINT "sync_mutations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sync_mutations_created_idx" ON "sync_mutations" USING btree ("created_at");