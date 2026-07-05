CREATE TABLE IF NOT EXISTS "_board_workspace_members" (
	"boardId" bigint NOT NULL,
	"workspaceMemberId" bigint NOT NULL,
	CONSTRAINT "_board_workspace_members_boardId_workspaceMemberId_pk" PRIMARY KEY("boardId","workspaceMemberId")
);
--> statement-breakpoint
ALTER TABLE "_board_workspace_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "board" ADD COLUMN "dueDate" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_board_workspace_members" ADD CONSTRAINT "_board_workspace_members_boardId_board_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_board_workspace_members" ADD CONSTRAINT "_board_workspace_members_workspaceMemberId_workspace_members_id_fk" FOREIGN KEY ("workspaceMemberId") REFERENCES "public"."workspace_members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
