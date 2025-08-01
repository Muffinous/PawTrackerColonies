import React, { useEffect, useState } from 'react';
import { Cat } from '../../models/Cat';
import { getCatImage } from '../../services/cat.service';
import catPlaceholderImage from '../../assets/placeholders/cat-placeholder.png'; // Adjust the path as necessary
import './CatCard.css';

interface CatCardProps {
    cat: Cat;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const CatCard: React.FC<CatCardProps> = ({ cat, checked, onChange }) => {
    const [imgSrc, setImgSrc] = useState('');

    useEffect(() => {
        if (cat.img) {
            getCatImage(cat.img).then(setImgSrc);
        } else {
            setImgSrc(catPlaceholderImage); // Set to empty if no image is available 
        }
    }, [cat.img]);

    return (
        <div className="cat-card-asssign" key={cat.id}>
            <img src={imgSrc} alt={cat.name} />
            <div className="cat-card-row">
                <div className="cat-card-name">{cat.name}</div>
                <label className="custom-checkbox">
                    <input
                        type="checkbox"
                        value={cat.id ?? ''}
                        checked={checked}
                        onChange={e => onChange(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                </label>
            </div>
        </div>
    );
};

export default CatCard;