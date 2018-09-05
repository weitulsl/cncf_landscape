import React from 'react';
import _ from 'lodash'
import InternalLink from '../InternalLink';

const itemWidth = 36;
const itemHeight = 32;

const Item = function({zoom, item, x, y, isLarge, onSelectItem}) {
  if (isLarge) {
    return new LargeItem({zoom, item, x, y, onSelectItem});
  }
  const k = 1;
  return <div style={{
    cursor: 'pointer',
    position: 'absolute',
    left: (itemWidth * x + 5) * zoom,
    top: (itemHeight * y) * zoom,
    width: (itemWidth  * k) * zoom,
    height: (itemHeight * k) * zoom }}>
    <img src={item.href} style={{
      width: (itemWidth * k - 2) * zoom,
      height: (itemHeight * k - 2) * zoom,
      margin: 2 * zoom,
      padding: 2 * zoom,
      border: `${1 * zoom}px solid grey`,
      borderRadius: 3 * zoom,
      background: item.oss ? '' : '#eee'
    }}
    onClick={ () => onSelectItem(item.id)}
  />
  </div>;
}

const LargeItem = function({zoom, item, x, y, onSelectItem}) {
  const k = 2;
  const color = {
    'sandbox': 'rgb(108, 165, 209)',
    'incubating': 'rgb(83, 113, 189)',
    'graduated': 'rgb(24, 54, 114)'
  }[item.cncfRelation];
  const label = {
    'sandbox': 'CNCF Sandbox',
    'incubating': 'CNCF Incubating',
    'graduated': 'CNCF Graduated'
  }[item.cncfRelation];
  return <div style={{
    cursor: 'pointer',
    position: 'absolute',
    border: `${2 * zoom}px solid ${color}`,
    left: (itemWidth * x + 5 + 3) * zoom,
    top: (itemHeight * y + 3) * zoom,
    width: (itemWidth  * k - 6) * zoom,
    height: (itemHeight * k - 6) * zoom }}
    onClick={ () => onSelectItem(item.id)}
  >
    <img src={item.href} style={{
      width: (itemWidth * k - 9 - 2) * zoom,
      height: (itemHeight * k - 9 - 2 - 10) * zoom,
      margin: 2 * zoom,
      padding: 2 * zoom
    }} />
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 10 * zoom, textAlign: 'center', background: color, color: 'white', fontSize: 7.8 * zoom, lineHeight: `${13 * zoom}px`}}>
    {label}
  </div>
  </div>;
}

const HorizontalSubcategory = function({zoom, subcategory, rows, onSelectItem, parentHeight}) {
  const categoryHeight = rows;
  const total = _.sumBy(subcategory.items, function(item) {
    return item.cncfProject ? 4 : 1;
  });
  const items = subcategory.items;
  const cols = Math.max(Math.ceil(total / categoryHeight ), 2);
  const width = itemWidth * cols;
  const height = itemHeight * categoryHeight;
  const offset = (parentHeight - 20 - height) / 2;
  let x = 0;
  let y = 0;
  let busy = {};
  return <div style={{ width: (width + 20) * zoom, height: height * zoom, marginTop: (20 + offset) * zoom,  position: 'relative' }}>
    { items.map(function(item) {
      const isLarge = !!item.cncfProject;
      const result = {zoom: zoom, item, y: y, x: x, isLarge: isLarge, onSelectItem: onSelectItem};
      busy[`${x}:${y}`] = true;
      if (isLarge) {
        busy[`${x + 1}:${y}`] = true;
        busy[`${x}:${y+1}`] = true;
        busy[`${x + 1}:${y+1}`] = true;
      }
      while(busy[`${x}:${y}`]) {
        x += 1;
        if (x >= cols) {
          x = 0;
          y += 1;
        }
      }

      return new Item(result);
    }) }
  </div>
};

const VerticalSubcategory = function({zoom, subcategory, cols, onSelectItem}) {
  const categoryWidth = cols;
  const total = _.sumBy(subcategory.items, function(item) {
    return item.cncfProject ? 4 : 1;
  });
  const items = _.orderBy(subcategory.items, (x) => !x.cncfProject);
  const raws = Math.ceil(total / categoryWidth );
  const height = itemHeight * raws;
  const width  = itemWidth * categoryWidth;
  let x = 0;
  let y = 0;
  let busy = {};
  return <div style={{ width: width * zoom, height: height * zoom, position: 'relative' }}>
    { items.map(function(item) {
      const isLarge = !!item.cncfProject;
      const result = {zoom: zoom, item, y: y, x: x, isLarge: isLarge, onSelectItem: onSelectItem};
      busy[`${x}:${y}`] = true;
      if (isLarge) {
        busy[`${x + 1}:${y}`] = true;
        busy[`${x}:${y+1}`] = true;
        busy[`${x + 1}:${y+1}`] = true;
      }
      while(busy[`${x}:${y}`]) {
        x += 1;
        if (x >= categoryWidth) {
          x = 0;
          y += 1;
        }
      }

      return new Item(result);
    }) }
  </div>
};

const Separator = function({zoom}) {
  return <div style={{ right: 5 * zoom, top: 35 * zoom, bottom: 5 * zoom, border: `${1 / 2 * zoom}px solid black`, width: 1 * zoom, position: 'absolute' }}></div>
}

const HorizontalCategory = function({header, subcategories, rows, width, height, top, left, zoom, color, href, onSelectItem}) {
  return (
    <div style={{
      position: 'absolute', height: height * zoom, margin: 5 * zoom, width: width * zoom, top: (top - 5) * zoom, left: left * zoom
    }} >
      <div style={{transform: 'rotate(-90deg)', width: (height - 20) * zoom, height: 30 * zoom, top: ((height + 20) / 2 - 30 / 2) * zoom, left: (-(height / 2 - 30/2) + 20/2) * zoom, textAlign: 'center', position: 'absolute', background:color, color: 'white', fontSize: 13 * zoom, lineHeight: `${30 * zoom}px`}}>
        <InternalLink to={href}>
          <span style={{
            color: 'white',
            fontSize: 12 * zoom,
            lineHeight: `{30 * zoom}px`
          }}>{header}</span>
        </InternalLink>
      </div>
      <div style={{width: 40 * zoom, display: 'inline-block'}} />
      <div style={{position: 'absolute', border: `${1 * zoom}px solid ${color}`, background: 'white', top: 20 * zoom, bottom: 0, left: 30 * zoom, right: 0}}></div>
      <div style={{position: 'absolute', top: 20 * zoom, bottom: 0, left: 0, right: 0,
        boxShadow: `0 ${4 * zoom}px ${8 * zoom}px 0 rgba(0, 0, 0, 0.2), 0 ${6 * zoom}px ${20 * zoom}px 0 rgba(0, 0, 0, 0.19)`
      }}></div>
      {subcategories.map(function(subcategory, index, all) {
        return <div style={{position: 'relative', display: 'inline-block', fontSize: `${10 * zoom}px`}}>
          <span style={{textAlign: 'center', position: 'absolute', width: '100%', minWidth: 100, transform: 'translate(-50%, 0%)', left: '50%'}}>
            <InternalLink to={subcategory.href}>
              <span style={{
                color: 'white',
                fontSize: 10 * zoom
              }}>{subcategory.name}</span>
            </InternalLink>
          </span>
          <HorizontalSubcategory subcategory={subcategory} rows={rows} zoom={zoom} onSelectItem={onSelectItem} parentHeight={height} />
          { index !== all.length - 1 && <Separator zoom={zoom} /> }
        </div>
      })}

  </div>);
}

const VerticalCategory = function({header, subcategories, cols = 6, top, left, width, height, color, zoom, href, onSelectItem}) {
  return (<div style={{}}>
    <div style={{
      position: 'absolute', top: top -5 * zoom, left: left * zoom, height: height * zoom, margin: 5 * zoom, width: (width + 2) * zoom, background: 'white', border: `${1 * zoom}px solid ${color}`,
      boxShadow: `0 ${4 * zoom}px ${8 * zoom}px 0 rgba(0, 0, 0, 0.2), 0 ${6 * zoom}px ${20 * zoom}px 0 rgba(0, 0, 0, 0.19)`
    }} >
    <div style={{ width: width * zoom, height: 20 * zoom, lineHeight: `${20 * zoom}px`, textAlign: 'center', color: 'white', background: color, fontSize: 12 * zoom}}>
        <InternalLink to={href}>
          <span style={{
            color: 'white',
            fontSize: 12 * zoom
          }}>{header}</span>
        </InternalLink>
    </div>
      {subcategories.map(function(subcategory) {
        return <div style={{position: 'relative'}}>
          <div style={{ fontSize: 10 * zoom, lineHeight: `${15 * zoom}px`, textAlign: 'center', color: color}}>
            <InternalLink to={subcategory.href}>
              <span style={{
                color: color,
                fontSize: 10 * zoom
              }}>{subcategory.name}</span>
            </InternalLink>
          </div>
          <VerticalSubcategory subcategory={subcategory} zoom={zoom} cols={cols} onSelectItem={onSelectItem} />
        </div>
      })}
    </div>
  </div>);
}

export {
  HorizontalCategory,
  VerticalCategory
};
