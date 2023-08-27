import { ChatMessage } from './';

export const ChatMessages = () => {
  return (
    <div className="px-20 flex-1 pt-10 flex flex-col gap-6 overflow-auto">
      {Array.from({ length: 35 }, (_, i) => (
        <ChatMessage
          avatar=""
          name="Sergio"
          content="Tellus id interdum velit laoreet. Egestas congue quisque egestas diam in. Elementum pulvinar etiam non quam lacus suspendisse faucibus. Cursus eget nunc scelerisque viverra mauris in aliquam. Sem fringilla ut morbi tincidunt augue interdum velit euismod. Lacus vel facilisis volutpat est velit egestas. Mi proin sed libero enim sed faucibus turpis in eu. Massa tempor nec feugiat nisl pretium fusce. Amet massa vitae tortor condimentum lacinia quis vel eros donec. Scelerisque eu ultrices vitae auctor eu augue ut. Nam libero justo laoreet sit amet cursus sit amet dictum. Pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies. Lorem ipsum dolor sit amet consectetur adipiscing. Tincidunt augue interdum velit euismod in pellentesque massa. Tincidunt ornare massa eget egestas purus viverra. Ultrices gravida dictum fusce ut placerat orci. In fermentum et sollicitudin ac orci. Lectus magna fringilla urna porttitor. Eu turpis egestas pretium aenean pharetra magna ac. Enim nunc faucibus a pellentesque sit amet porttitor eget."
          date={new Date()}
          key={i}
        />
      ))}
    </div>
  );
};
