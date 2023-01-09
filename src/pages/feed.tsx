export function Feed() {
  // this page is only loaded if the user is authenticated
  // so we can safely assume that the user is logged in
  // fetch the user id from firebase auth object
  // fetch the user object from firestore
  // the user object will contain an 'entry' field which is the value of today's entry, if any
  // if there is no entry, display a message saying so
  return (
    <div>
      <h1>Your feed appears here. This is a placeholder for now.</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim error
        atque, est exercitationem corrupti eaque, veniam dolorum aut, reiciendis
        cupiditate earum deserunt consequatur a aliquid magni quam at magnam
        numquam.
      </p>
    </div>
  );
}
