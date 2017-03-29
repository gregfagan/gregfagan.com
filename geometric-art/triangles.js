import React from 'react';
import ReactDOM from 'react-dom';
import _range from 'lodash/range'

export default class Triangles extends React.Component {
  constructor() {
    super();
    this.state = { elapsedTime: 0 };
  }

  componentWillMount() {
    this.startTime = performance.now();
    this.step = currentTime => {
      const elapsedTime = currentTime - this.startTime;
      // TODO: running this unthrottled at 60 Hz is noticeably straining
      // on my CPU/battery; this is one simple throttle mechanism, but
      // I'm going to experiment with alternative solutions.
      // if (elapsedTime - this.state.elapsedTime > 100) {
        this.setState({ elapsedTime });
      // }
      this.raf = requestAnimationFrame(this.step);
    };
    this.raf = requestAnimationFrame(this.step);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }

  render() {
    const { sideLength, spacing, color, width, height, ...rest } = this.props;
    const { elapsedTime } = this.state;
    const hCount = 2 * width / (sideLength + spacing) + 2;
    const vCount = height / (equilateralHeight(sideLength) + spacing) + 2;

    return (
      <div style={{width: '100vw', height: '100vh'}}>
        <svg width='100%' height='100%'>
          <g transform={`translate(-${sideLength + spacing})`}>
          {
            _range(hCount).map(i => (
              _range(vCount).map(j => (
                <EquilateralTriangle
                  sideLength={sideLength}
                  flip={(i % 2)}
                  fill={color(i/hCount, j/vCount, elapsedTime)}
                  transform={`translate(
                    ${i * (sideLength/2 + spacing) + (j % 2) * (sideLength/2 + spacing)},
                    ${j * (equilateralHeight(sideLength) + spacing)}
                  )`}
                  key={`${i}.${j}`}
                />
              ))
            ))
          }
          </g>
        </svg>
      </div>
    );
  }
}

function equilateralHeight(sideLength) {
  return sideLength * 0.86602540378; // √3 / 2
}

function EquilateralTriangle(props) {
  const { sideLength, flip, ...rest } = props;
  return (
    <g {...rest}>
      <polygon
        points={`0,0 ${sideLength},0 ${sideLength/2},${equilateralHeight(sideLength)}`}
        transform={flip && `translate(${sideLength}, ${equilateralHeight(sideLength)}) rotate(180)` || ''}
      />
    </g>
  );
}
