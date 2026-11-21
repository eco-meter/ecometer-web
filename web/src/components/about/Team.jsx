import "./Team.css";

const team = [
  { name: "Ewan McNeil", title: "CEO" },
  { name: "Carson Ko", title: "CFO" },
  { name: "Rainbow Yang", title: "CMO" },
  { name: "Crystal Nguyen", title: "CTO" },
];

export default function Team() {
  return (
    <section className='team'>
      <div className='team__heading'>
        <p className='team__eyebrow'>OUR TEAM</p>
        <h2>The people behind the score</h2>
        <p className='team__intro'>
          A small Vancouver team of researchers, designers, and restaurant folks
          who wanted a better answer to "where should we go?"
        </p>
      </div>

      <div className='team__row'>
        {team.map((member) => (
          <div className='team__member' key={member.name}>
            <div className='team__photo' />
            <div className='team__info'>
              <p className='team__name'>{member.name}</p>
              <p className='team__title'>{member.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
