import ReactStars from "react-rating-stars-component";

const Rating  = ( {count, rating, onChange, editable} ) => {
  return (
    <div style={{
      pointerEvents: editable ? 'auto' : 'none',
      cursor: editable ? 'pointer' : 'default'
    }}>
      <ReactStars
        count={count ? count : 5}
        value={rating}
        onChange={onChange}
        size={24}
        isHalf={true}
        emptyIcon={<i className="far fa-star"></i>}
        halfIcon={<i className="fa fa-star-half-alt"></i>}
        fullIcon={<i className="fa fa-star"></i>}
        activeColor="#ffd700"
        edit={editable}
      />
    </div>
  );
}
export default Rating;