const staffImages = import.meta.glob('@/assets/staff/*.{jpg,png}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

// Returns the avatar for a staff member, falling back to a default image if none is found.
export function getStaffAvatarUrl(lastName: string): string {
  return (
    staffImages[`/src/assets/staff/${lastName}.jpg`] ||
    staffImages[`/src/assets/staff/${lastName}.png`] ||
    staffImages['/src/assets/staff/user.png']
  );
}
